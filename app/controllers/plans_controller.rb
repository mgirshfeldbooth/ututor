class PlansController < ApplicationController
  before_action :set_plan, only: %i[ show edit update destroy ]
  before_action :require_user_be_tutor

  # GET /plans or /plans.json
  def index
    @plans = Plan.all
  end

  # GET /plans/1 or /plans/1.json
  def show
  end

  # GET /plans/new
  def new
    @plan = Plan.new
  end

  # GET /plans/1/edit
  def edit
  end

  # POST /plans or /plans.json
  def create
    @plan = Plan.new
    @plan.tutor_id = current_user.id

    # find the student by email
    student = User.find_by(email: params.fetch("query_student_email"))
    @plan.student_id = student.id if student

    @plan.subject_id = params.fetch("query_subject_id")
    @plan.round_size = params.fetch("query_round_size")

    respond_to do |format|
      if @plan.save
        format.html { redirect_to root_path, notice: "Plan was successfully created." }
        format.json { render :show, status: :created, location: @plan }
      else
        format.html { redirect_to root_path, status: :unprocessable_entity }
        format.json { render json: @plan.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /plans/1 or /plans/1.json
  def update
    respond_to do |format|
      if @plan.update(plan_params)
        format.html { redirect_to root_path, notice: "Plan was successfully updated." }
        format.json { render :show, status: :ok, location: @plan }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @plan.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /plans/1 or /plans/1.json
  def destroy
    @plan.destroy

    respond_to do |format|
      format.html { redirect_to root_path, notice: "Plan was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_plan
      @plan = Plan.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def plan_params
      params.require(:plan).permit(:tutor_id, :student_id, :subject_id, :round_size)
    end

    def require_user_be_tutor
      unless current_user.tutor?
        redirect_back fallback_location: root_path
      end
    end
end
