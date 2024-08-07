// utils/helpers.go
package utils

// Contains checks if an array contains a string
func Contains(arr [30]string, team string) bool {
	for _, t := range arr {
		if t == team {
			return true
		}
	}
	return false
}
