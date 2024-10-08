package controllers

import (
	"bytes"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"

	"nba-backend/models"
	"nba-backend/utils"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetAuthToken() (string, error) {
	pyzData := map[string]string{
		"app_id":     os.Getenv("PAYIZONE_API_KEY"),
		"app_secret": os.Getenv("PAYIZONE_API_SECRET"),
	}

	return PostRequest("https://service.payizone.com/token", pyzData)
}

func GetPayToken(authToken string, data map[string]interface{}) (string, error) {
	return PostAuthRequest("https://service.payizone.com/getPos", authToken, data)
}

func Pay3D(authToken string, pyzData map[string]interface{}) (string, error) {
	return PostAuthRequest("https://service.payizone.com/pay3D", authToken, pyzData)
}

func PostRequest(url string, data map[string]string) (string, error) {
	jsonData, err := json.Marshal(data)
	if err != nil {
		return "", err
	}

	resp, err := http.Post(url, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	var result map[string]interface{}
	err = json.Unmarshal(body, &result)
	if err != nil {
		return "", err
	}

	codeFloat, ok := result["code"].(float64)
	if !ok {
		return "", fmt.Errorf("failed to get token, response: %s", body)
	}

	code := int(codeFloat)
	if code == 200 {
		return result["token"].(string), nil
	}
	return "", fmt.Errorf("failed to get token, response: %s", body)
}

func PostAuthRequest(url, authToken string, data map[string]interface{}) (string, error) {
	jsonData, err := json.Marshal(data)
	if err != nil {
		return "", err
	}

	client := &http.Client{}
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return "", err
	}

	req.Header.Set("User-Agent", os.Getenv("PAYIZONE_API_KEY"))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+authToken)

	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	var result map[string]interface{}
	err = json.Unmarshal(body, &result)
	if err != nil {
		return "", err
	}

	codeFloat, ok := result["code"].(float64)
	if !ok {
		return "", fmt.Errorf("failed to get token, response: %s", body)
	}

	code := int(codeFloat)
	if code == 200 {
		if payToken, exists := result["payToken"]; exists {
			return payToken.(string), nil
		} else if redirectUrl, exists := result["redirectUrl"]; exists {
			return redirectUrl.(string), nil
		}
	}

	return "", fmt.Errorf("failed to get token, response: %s", body)
}

// Verification function for the payment
func VerifyPayment(c *gin.Context) {

	// Parse form data
	if err := c.Request.ParseForm(); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Extract values
	receivedStatus := c.Request.FormValue("status") == "1"
	resultCode := c.Request.FormValue("resultCode")
	verifyHash := c.Request.FormValue("VerifyHash")
	otherCode := c.Request.FormValue("otherCode")
	saleID := c.Request.FormValue("saleID")

	// Convert resultCode and saleID to integer
	var resultCodeInt, saleIDInt int
	host_url := os.Getenv("HOST_URL")
	if _, err := fmt.Sscanf(resultCode, "%d", &resultCodeInt); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid resultCode"})
		c.Redirect(http.StatusFound, host_url+"/payment/fail")
		return
	}
	if _, err := fmt.Sscanf(saleID, "%d", &saleIDInt); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid saleID"})
		c.Redirect(http.StatusFound, host_url+"/payment/fail")
		return
	}

	verifyKey := os.Getenv("PAYIZONE_API_KEY") + "|" + os.Getenv("PAYIZONE_API_SECRET") + "|" + otherCode + "|true"
	expectedHash := sha256.New()
	expectedHash.Write([]byte(verifyKey))
	expectedHashStr := hex.EncodeToString(expectedHash.Sum(nil))

	// Save the payment to the database
	var status bool
	if receivedStatus && verifyHash == expectedHashStr {
		status = true

	} else {
		status = false
	}
	if !status {
		c.Redirect(http.StatusFound, host_url+"/payment/fail")
		return
	}

	db := utils.GetDB()

	var planType models.PlanType
	if err := db.Where("other_code = ?", otherCode).First(&planType).Error; err != nil {
		c.Redirect(http.StatusFound, host_url+"/payment/fail")
		return
	}

	var user models.User
	if err := db.Preload("Subscriptions").Where("id = ?", planType.UserID).First(&user).Error; err != nil {
		c.Redirect(http.StatusFound, host_url+"/payment/fail")
		return
	}

	var maxSubscriptions int = planType.MaxSubscriptions
	user.AccountType = planType.Plan
	user.MaxSubscriptions = maxSubscriptions
	user.Extended = false
	user.StartsAt = time.Now()
	user.ExpiresAt = time.Now().AddDate(0, 1, 0)

	if len(user.Subscriptions) > maxSubscriptions {
		user.Subscriptions = user.Subscriptions[:maxSubscriptions]
	}

	if err := db.Save(&user).Error; err != nil {
		c.Redirect(http.StatusFound, host_url+"/payment/fail")
		return
	}

	var subscriptionTeamIDs []int
	for _, sub := range user.Subscriptions {
		subscriptionTeamIDs = append(subscriptionTeamIDs, sub.TeamID)
	}

	if len(subscriptionTeamIDs) > 0 {
		if err := db.Where("user_id = ? AND team_id NOT IN (?)", user.ID, subscriptionTeamIDs).Unscoped().Delete(&models.Subscription{}).Error; err != nil {
			fmt.Printf("Error deleting subscription: %v", err)
			return
		}
	}

	c.Redirect(http.StatusFound, host_url+"/payment/success")
}

func CreatePayment(c *gin.Context) {
	db := utils.GetDB()

	type Payment struct {
		UserID     uint   `json:"user_id"`
		CardHolder string `json:"card_holder"`
		CardNumber string `json:"card_number"`
		ExpMonth   string `json:"exp_month"`
		ExpYear    string `json:"exp_year"`
		CVV        string `json:"cvv"`
		Amount     int    `json:"amount"`
	}

	var payment Payment
	if err := c.ShouldBindJSON(&payment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID := payment.UserID
	cardHolder := payment.CardHolder
	cardNumber := payment.CardNumber
	expMonth := payment.ExpMonth
	expYear := payment.ExpYear
	cvv := payment.CVV
	amount := payment.Amount

	var user models.User
	if err := db.Where("id = ?", userID).First(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
		return
	}

	if user.AccountType != "Free" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User already has a " + user.AccountType + " account"})
		return
	}

	// Initial authentication to get authToken
	authToken, err := GetAuthToken()
	if err != nil {
		fmt.Println("authToken could not be received:")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Authorization token not received"})
		return
	}

	// Data for the payment request
	data := map[string]interface{}{
		"card_number": cardNumber,
		"amount":      amount,
		"installment": "1",
	}

	payToken, err := GetPayToken(authToken, data)
	if err != nil {
		fmt.Println("payToken could not be received:")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Payment token not received"})
		return
	}

	// Other code (for verifying later)
	otherCode := fmt.Sprintf("%x", sha256.Sum256([]byte(time.Now().String())))

	// Data for the 3D payment request
	pyzData := map[string]interface{}{
		"card_holder":   cardHolder,
		"card_number":   cardNumber,
		"exp_month":     expMonth,
		"exp_year":      expYear,
		"cvv":           cvv,
		"amount":        amount,
		"currency":      "TRY",
		"payment_token": payToken,
		"installment":   "1",
		"other_code":    otherCode,
		"redirect_url":  os.Getenv("PAYIZONE_CALLBACK_URL"),
	}

	redirectURL, err := Pay3D(authToken, pyzData)
	if err != nil {
		fmt.Println("Payment failed:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Payment failed"})
		return
	}

	// Save the plan type to the database
	var plan string
	var maxSubscriptions int
	if amount == 5 {
		plan = "Premium"
		maxSubscriptions = 10
	} else if amount == 10 {
		plan = "Deluxe"
		maxSubscriptions = 20
	}

	planType := models.PlanType{
		UserID:           userID,
		Plan:             plan,
		Price:            amount,
		MaxSubscriptions: maxSubscriptions,
		OtherCode:        otherCode,
	}

	if err := db.Create(&planType).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"redirect_url": redirectURL})
}

func CheckPremiumExpired() {
	db := utils.GetDB()

	var users []models.User
	// Find users whose deluxe and premium subscriptions have expired
	err := db.Where("max_subscriptions != ? AND expires_at < ?", 5, time.Now()).Find(&users).Error
	if err != nil {
		fmt.Printf("Error fetching users: %v", err)
		return
	}

	for _, user := range users {
		if user.Extended {
			HandleExpiredSubscription(&user, db)
		} else {
			ExtendSubscription(&user, db)
		}
	}
}

func ExtendSubscription(user *models.User, db *gorm.DB) {
	// Extend the subscription by 1 week
	user.AccountType = "Free"
	user.StartsAt = time.Now()
	user.ExpiresAt = time.Now().AddDate(0, 0, 7)
	user.Extended = true

	// Save the updated user data
	if err := db.Save(user).Error; err != nil {
		fmt.Printf("Error updating user %s: %v", user.Email, err)
		return
	}

	// Send an email notification to the user
	if err := utils.SendSubscriptionExpiryEmail(user.Email, user.AccountType); err != nil {
		fmt.Printf("Error sending email to %s: %v", user.Email, err)
	}
}

func HandleExpiredSubscription(user *models.User, db *gorm.DB) {
	db.Preload("Subscriptions").Where("id = ?", user.ID).First(user)

	user.MaxSubscriptions = 5
	user.StartsAt = time.Now()
	user.ExpiresAt = time.Now()
	user.Extended = false

	// Trim subscriptions to fit the free account limit
	if len(user.Subscriptions) > 5 {
		user.Subscriptions = user.Subscriptions[:5]
	}

	// Save the updated user data
	if err := db.Save(user).Error; err != nil {
		fmt.Printf("Error updating user %s: %v", user.Email, err)
		return
	}

	var subscriptionTeamIDs []int
	for _, sub := range user.Subscriptions {
		subscriptionTeamIDs = append(subscriptionTeamIDs, sub.TeamID)
	}

	if len(subscriptionTeamIDs) > 0 {
		if err := db.Where("user_id = ? AND team_id NOT IN (?)", user.ID, subscriptionTeamIDs).Unscoped().Delete(&models.Subscription{}).Error; err != nil {
			fmt.Printf("Error deleting subscription: %v", err)
			return
		}
	}
}

func ClearPlanTypes() {
	db := utils.GetDB()
	db.Where("created_at < ?", time.Now().AddDate(0, 0, -1)).Unscoped().Delete(&models.PlanType{})
}
