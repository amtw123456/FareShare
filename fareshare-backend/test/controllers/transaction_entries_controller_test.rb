require "test_helper"

class TransactionEntriesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @transaction_entry = transaction_entries(:one)
  end

  test "should get index" do
    get transaction_entries_url, as: :json
    assert_response :success
  end

  test "should create transaction_entry" do
    assert_difference("TransactionEntry.count") do
      post transaction_entries_url, params: { transaction_entry: { amount: @transaction_entry.amount, description: @transaction_entry.description, title: @transaction_entry.title, user_id: @transaction_entry.user_id } }, as: :json
    end

    assert_response :created
  end

  test "should show transaction_entry" do
    get transaction_entry_url(@transaction_entry), as: :json
    assert_response :success
  end

  test "should update transaction_entry" do
    patch transaction_entry_url(@transaction_entry), params: { transaction_entry: { amount: @transaction_entry.amount, description: @transaction_entry.description, title: @transaction_entry.title, user_id: @transaction_entry.user_id } }, as: :json
    assert_response :success
  end

  test "should destroy transaction_entry" do
    assert_difference("TransactionEntry.count", -1) do
      delete transaction_entry_url(@transaction_entry), as: :json
    end

    assert_response :no_content
  end
end
