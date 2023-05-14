class AddGradeOrganizationAndParentEmailToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :grade, :integer
    add_column :users, :organization, :string
    add_column :users, :parent_email, :string
  end
end
