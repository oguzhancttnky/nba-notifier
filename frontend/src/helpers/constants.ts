export const teamsDictionary: { [key: number]: [string, string] } = {
  1: ["ATL", "Atlanta Hawks"],
  2: ["BOS", "Boston Celtics"],
  3: ["BKN", "Brooklyn Nets"],
  4: ["CHA", "Charlotte Hornets"],
  5: ["CHI", "Chicago Bulls"],
  6: ["CLE", "Cleveland Cavaliers"],
  7: ["DAL", "Dallas Mavericks"],
  8: ["DEN", "Denver Nuggets"],
  9: ["DET", "Detroit Pistons"],
  10: ["GSW", "Golden State Warriors"],
  11: ["HOU", "Houston Rockets"],
  12: ["IND", "Indiana Pacers"],
  13: ["LAC", "LA Clippers"],
  14: ["LAL", "Los Angeles Lakers"],
  15: ["MEM", "Memphis Grizzlies"],
  16: ["MIA", "Miami Heat"],
  17: ["MIL", "Milwaukee Bucks"],
  18: ["MIN", "Minnesota Timberwolves"],
  19: ["NOP", "New Orleans Pelicans"],
  20: ["NYK", "New York Knicks"],
  21: ["OKC", "Oklahoma City Thunder"],
  22: ["ORL", "Orlando Magic"],
  23: ["PHI", "Philadelphia 76ers"],
  24: ["PHX", "Phoenix Suns"],
  25: ["POR", "Portland Trail Blazers"],
  26: ["SAC", "Sacramento Kings"],
  27: ["SAS", "San Antonio Spurs"],
  28: ["TOR", "Toronto Raptors"],
  29: ["UTA", "Utah Jazz"],
  30: ["WAS", "Washington Wizards"],
};

const server_host_url = process.env.REACT_APP_SERVER_HOST_URL;
const api_version = process.env.REACT_APP_API_VERSION;
const api_gateway_url = `${server_host_url}${api_version}`;

export const APIs = {
  login_api: api_gateway_url + process.env.REACT_APP_LOGIN_ENDP,
  register_api: api_gateway_url + process.env.REACT_APP_REGISTER_ENDP,
  forgot_password_send_email_api: api_gateway_url + process.env.REACT_APP_FORGOT_PASSWORD_SEND_EMAIL_ENDP,
  reset_password_api: api_gateway_url + process.env.REACT_APP_RESET_PASSWORD_ENDP?.split(":")[0],
  verify_jwt_api: api_gateway_url + process.env.REACT_APP_VERIFY_JWT_TOKEN_ENDP,

  telegram_message_send_api: api_gateway_url + process.env.REACT_APP_TELEGRAM_MESSAGE_SEND_ENDP,
  telegram_message_received_api: api_gateway_url + process.env.REACT_APP_TELEGRAM_MESSAGE_RECEIVED_ENDP,

  get_user_by_user_id_api: api_gateway_url + process.env.REACT_APP_GET_USER_BY_USER_ID_ENDP?.split(":")[0],
  update_user_by_user_id_api: api_gateway_url + process.env.REACT_APP_UPDATE_USER_BY_USER_ID_ENDP?.split(":")[0],
  get_subscriptions_by_user_id_api: api_gateway_url + process.env.REACT_APP_GET_SUBSCRIPTIONS_BY_USER_ID_ENDP?.split(":")[0],

  payizone_payment_api: api_gateway_url + process.env.REACT_APP_PAYIZONE_PAYMENT_ENDP,
  payizone_callback_api: api_gateway_url + process.env.REACT_APP_PAYIZONE_CALLBACK_ENDP,

  subscribe_nba_team_api: api_gateway_url + process.env.REACT_APP_SUBSCRIBE_NBA_TEAM_ENDP,
  unsubscribe_nba_team_api: api_gateway_url + process.env.REACT_APP_UNSUBSCRIBE_NBA_TEAM_ENDP,
};
