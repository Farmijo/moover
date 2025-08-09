class ChangeRoomIdToOptionalInUserTasks < ActiveRecord::Migration[7.1]
  def change
    change_column_null :user_tasks, :room_id, true
  end
end
