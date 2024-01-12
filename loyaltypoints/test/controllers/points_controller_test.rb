require "test_helper"

class PointsControllerTest < ActionDispatch::IntegrationTest
  test "balance with invalid user ID" do
    get "/points/balance/blah"
    assert_response 400
    body = JSON.parse(response.body)
    assert_equal(I18n.t("invalid_user_id"), body["error_message"])
  end

  test "balance with user ID not found" do
    get "/points/balance/123456"
    assert_response 404
    body = JSON.parse(response.body)
    assert_equal(I18n.t("user_not_found"), body["error_message"])
  end

  # let"s take advantage of the fact that we have fixtures to set default data
  test "balance with valid user ID" do
    get "/points/balance/1"
    assert_response :success
    body = JSON.parse(response.body)
    assert_equal(users(:one).id, body["id"])
    assert_equal(users(:one).balance, body["balance"])
  end

  test "invalid balance redemption" do
    # User 1 has 100 points by default, an amount of 20 is equivalent to
    # 20 * 100 = 200 points and is thus invalid redemption amount.
    post "/points/redeem/1", params: { amount: 20 }
    assert_response 400
    body = JSON.parse(response.body)
    assert_equal(I18n.t("invalid_points"), body["error_message"])
  end

  test "valid balance redemption" do
    post "/points/redeem/1", params: { amount: 10 }
    assert_response 200
  end

  test "invalid balance addition" do
    post "/points/add/1", params: { amount: -13234 }
    assert_response 400
    body = JSON.parse(response.body)
    assert_equal(I18n.t("invalid_balance"), body["error_message"])
  end

  test "valid balance addition" do
    post "/points/add/1", params: { amount: 1000 }
    assert_response :success
  end

  test "transaction invalid pagination" do
    get "/points/transactions/1?page=2&page_size=300"
    assert_response 404
  end

  test "transaction valid pagination" do
    # let's create a "page" with page_size of 1.
    assert User.find(1).update(balance: 20), true
    assert BalanceHistory.where(user_id: 1), 2

    get "/points/transactions/1?page=2&page_size=1"

    assert_response :success
    body = JSON.parse(response.body).first
    assert_equal(body["startingBalance"], 100)
    assert_equal(body["endingBalance"], 20)
  end
end
