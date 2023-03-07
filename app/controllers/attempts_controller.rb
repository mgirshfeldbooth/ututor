class AttemptsController < ApplicationController
  before_action :set_attempt, only: %i[ show edit update destroy ]
  skip_forgery_protection

  # GET /attempts or /attempts.json
  def index
    @attempts = Attempt.all
  end

  # GET /attempts/1 or /attempts/1.json
  def show
  end

  # GET /attempts/new
  def new
    @attempt = Attempt.new
  end

  # GET /attempts/1/edit
  def edit
  end

  # POST /attempts or /attempts.json
  def create
    @attempt = Attempt.new

    @attempt.started_at = params[:starting_timestamp]
    @attempt.finished_at = DateTime.now.change(:offset => "+500")
    @attempt.submission = params.fetch("query_submission")

    @attempt.student_id = current_user.id
    @attempt.exercise_id = params.fetch("query_exercise_id")
    @attempt.round_id = params.fetch("query_round_id")
    @attempt.correct = (if @attempt.submission == @attempt.exercise.answer.to_f then true else false end)
    
    attempts_left = cookies.fetch(:attempts_left).to_i
    attempts_left -= 1
    cookies[:attempts_left] = attempts_left
    @assigned_subject_id = Plan.find_by(student_id: current_user.id).subject_id
    
    respond_to do |format|
      if @attempt.save
        if (attempts_left != 0)
          format.html { redirect_to exercise_path(Exercise.where( :difficulty => cookies.fetch(:user_level), subject_id: @assigned_subject_id ).shuffle.first.id), notice: "Attempt recorded!" }
          format.json { render :show, status: :created, location: @attempt }
        elsif (attempts_left == 0)
          format.html { redirect_to round_path(cookies.fetch(:current_round)), notice: "Attempt recorded and round complete!" }
          format.json { render :show, status: :created, location: @attempt }
        end
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @attempt.errors, status: :unprocessable_entity }
      end
    end

    # Adjusting user level here so that exercises are served at the right difficulty
    current_user_level = cookies.fetch(:user_level).to_i
    current_streak = cookies.fetch(:streak_counter).to_i

    if @attempt.correct 
      if (current_user_level != Exercise.maximum(:difficulty)) and (current_streak == 2)
        current_user_level += 1
        cookies[:user_level] = current_user_level
      else
        current_streak += 1
        cookies[:streak_counter] = current_streak
      end
    else
      if current_user_level != Exercise.minimum(:difficulty)
        current_user_level = current_user_level - 1
        cookies[:streak_counter] = 0
        cookies[:user_level] = current_user_level
      end
    end

    cookies[:attempt_started_at] = DateTime.now.change(:offset => "+500")
  end

  # PATCH/PUT /attempts/1 or /attempts/1.json
  def update
    respond_to do |format|
      if @attempt.update(attempt_params)
        format.html { redirect_to attempt_url(@attempt), notice: "Attempt was successfully updated." }
        format.json { render :show, status: :ok, location: @attempt }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @attempt.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /attempts/1 or /attempts/1.json
  def destroy
    @attempt.destroy

    respond_to do |format|
      format.html { redirect_to attempts_url, notice: "Attempt was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_attempt
      @attempt = Attempt.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def attempt_params
      params.require(:attempt).permit(:submission, :correct, :started_at, :finished_at, :exercise_id, :round_id, :student_id)
    end
end
