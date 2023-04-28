class RoundsController < ApplicationController
  before_action :set_round, only: %i[ show edit update destroy ]
  skip_forgery_protection

  # GET /rounds or /rounds.json
  def index
    @rounds = Round.all
  end

  # GET /rounds/1 or /rounds/1.json
  def show
  end

  # GET /rounds/new
  def new
    @round = Round.new
  end

  # GET /rounds/1/edit
  def edit
  end

  # POST /rounds or /rounds.json
  def create
    plan_selected = params.fetch("query_plan_selected") # this 'plan_selected' means 'free play' or 'practice plan'
    plan = Plan.find_by(student_email: current_user.email) # this finds the assigned subject plan

    if !params.has_key?("query_plan_selected")
      round_length = 10
    else
      if plan_selected == "freeplay"
          # FREE PLAY PLAN
        round_length = params.fetch("query_round_length", 10)
      elsif plan_selected == "practice" or plan_selected == "speedround"
        # TUTOR PRACTICE PLAN
        if plan
          round_length = Plan.find_by(student_email: current_user.email).round_size
        else
          round_length = 10
        end
        
      end
    end

    @round = Round.new(student_id: current_user.id)
    cookies[:attempts_left] = round_length
    # FIX: Requires a plan to be set by the tutor, else could return NIL. No plans yet, go make a plan or serve everything

    @assigned_subject_id = plan.subject_id if plan


    respond_to do |format|
      if @round.save
        if plan_selected == "freeplay" 
          # FREE PLAY PLAN
          format.html { redirect_to exercise_path(Exercise.where( difficulty: 0 ).shuffle.first.id), notice: "Round was successfully created." }
          exercise = Exercise.where( difficulty: 0 ).shuffle.first
        elsif plan_selected == "practice" or plan_selected == "speedround"
          # TUTOR PRACTICE PLAN
          if plan
            exercise = Exercise.joins(:subject).where(difficulty: 0, subjects: { id: @assigned_subject_id }).shuffle.first
            format.html { redirect_to exercise_path(exercise.id), notice: "Round was successfully created." }
          else
            exercise = Exercise.where(difficulty: 0).shuffle.first
            format.html { redirect_to exercise_path(exercise.id), notice: "Round was successfully created." }
          end
        end
        
        # Append round length to exercise
        edited_exercise = exercise.as_json.merge(round_length: round_length)
        format.json { render json: edited_exercise }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @round.errors, status: :unprocessable_entity }
      end
    end

    cookies[:user_level] = 0 
    cookies[:streak_counter] = 0
    cookies[:current_round] = @round.id
    cookies[:round_started_at] = DateTime.now.change(:offset => "+500")
    cookies[:attempt_started_at] = DateTime.now.change(:offset => "+500")
    
  end

  # PATCH/PUT /rounds/1 or /rounds/1.json
  def update
    respond_to do |format|
      if @round.update(round_params)
        format.html { redirect_to round_url(@round), notice: "Round was successfully updated." }
        format.json { render :show, status: :ok, location: @round }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @round.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /rounds/1 or /rounds/1.json
  def destroy
    @round.destroy

    respond_to do |format|
      format.html { redirect_to rounds_url, notice: "Round was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_round
      @round = Round.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def round_params
      params.require(:round).permit(:student_id)
    end
end
