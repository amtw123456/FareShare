require "test_helper"

class TransactionRelatedUsersControllerTest < ActionDispatch::IntegrationTest
  setup do
    @transaction_related_user = transaction_related_users(:one)
  end

  test "should get index" do
    get transaction_related_users_url, as: :json
    assert_response :success
  end

  test "should create transaction_related_user" do
    assert_difference("TransactionRelatedUser.count") do
      post transaction_related_users_url, params: { transaction_related_user: { amount: @transaction_related_user.amount, paid: @transaction_related_user.paid, transaction_entry_id: @transaction_related_user.transaction_entry_id, user_id: @transaction_related_user.user_id } }, as: :json
    end

    assert_response :created
  end

  test "should show transaction_related_user" do
    get transaction_related_user_url(@transaction_related_user), as: :json
    assert_response :success
  end

  test "should update transaction_related_user" do
    patch transaction_related_user_url(@transaction_related_user), params: { transaction_related_user: { amount: @transaction_related_user.amount, paid: @transaction_related_user.paid, transaction_entry_id: @transaction_related_user.transaction_entry_id, user_id: @transaction_related_user.user_id } }, as: :json
    assert_response :success
  end

  test "should destroy transaction_related_user" do
    assert_difference("TransactionRelatedUser.count", -1) do
      delete transaction_related_user_url(@transaction_related_user), as: :json
    end

    assert_response :no_content
  end
end
