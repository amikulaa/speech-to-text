<!-- view/EDAL/DAT/index.php -->
<div id='daily_appt_tracker' class="container-fluid">
	<div class="row">
		<form id='dat_form' method='POST' action=''>
			<div class="container rounded">
				<div class="row">
					<div class="col-md-8 border-right">
						<div class="p-3">
        					<div class="row mt-2">
								<div class="col-md-7">
        							<div class="d-flex justify-content-between align-items-center mb-3">
        								<h4 class="text-right">Daily Appointment Tracking Note</h4>
        							</div>
								</div>
								<div class="col-md-7">
        							<div class="error_msg_container">
        								<input id='error_msg' disabled>
        							</div>
								</div>
								<div class="col-md-2">
        							<label id="clock" class="float_right" onload="currentTime();"></label>
								</div>
								<div class="col-md-3">
        							<label id="date" class='BIG_LABEL GREY_TXT'><?php echo date('F j, Y')?></label>
								</div>
        					</div>
							<div class="row mt-2">
								<div class="col-md-12">
									<label class="labels">Patient Name</label>
									<input id="patient_name" name="patient_name" list="client_names" type="text" class="form-control" placeholder="select or enter name of patient" value="" onchange='log_patientname(this.value);' required>
									<datalist id="client_names">
										<?php echo $this->DAT_model->get_client_names();?>
									</datalist>
								</div>
							</div>
							<div class="row mt-2">
								<div class="col-md-6">
									<label class="labels">When are you filling this out relative to the session?</label>
									<select id="completion_time" name="completion_time" class="form-control" onchange="log_patientdate(this.value);" required>
										<option value='' selected hidden disabled>SELECT</option>
										<option value=0>During Session</option>
										<option value=1>End of Session</option>
										<option value=2>Day After Session</option>
									</select>
								</div>
								<div class="col-md-6">
									<label class="labels">How was today's session completed?</label>
									<select id="session_method" name="session_method" class="form-control" value="" onchange='update_method_note(this.value)' required>
										<option value='' selected hidden disabled>SELECT</option>
										<option value=0>In Person</option>
										<option value=1>Video/Audio</option>
										<option value=2>Audio Only</option>
									</select>
								</div>
							</div>
							<div id='client_location_container' class="row mt-2" hidden>
								<div class="col-md-12">
									<label class="labels">Client Location</label>
									<select id="client_location" name="client_location" class="form-control" value="" onchange='update_client_note(this.value)'>
										<option value='' selected hidden disabled>SELECT</option>
										<option value=0>Client at Home</option>
										<option value=1>Client Not at Home</option>
									</select>
								</div>
							</div>
							<div id='travel_mileage_container' class="row mt-2" hidden>
								<div class="col-md-6">
									<label class="labels">Travel Time</label>
									<input id='travel_time' name='travel_time' type="text" class="form-control MASK_TIME">
								</div>
								<div class="col-md-6">
									<label class="labels">Travel Mileage</label>
									<input id='travel_mileage' name='travel_mileage' type="number" min=0 step=.25 class="form-control">
								</div>
							</div>
							<div class="row mt-3">
								<div class="col-md-4">
									<label class="labels">Time Start</label><input id="session_start" name="session_start" type="time" class="form-control" onchange='log_patientstart(this.value)' value="" required>
								</div>
								<div class="col-md-4">
									<label class="labels">Time End</label><input id="session_end" name="session_end" type="time" class="form-control" onchange='log_patientend(this.value)' value="" required>
								</div>
								<div class="col-md-4">
									<label class="labels">Time Total</label><input id="session_time_total" name="session_time_total" type="text" value='' onchange='log_patienttotal(this.value)' class="form-control" value="" readonly required>
								</div>
							</div><br/>
							<!-- TEXT TO SPEECH TEXT AREA NAV -->
                            <p id="message" hidden aria-hidden="true">Your browser doesn't support Speech Recognition.</p>
							<div id='nav_container_one'>
    							<nav id='section_nav'>
    								<button id='section_one_button' type='button' class='textarea_nav' slot=1 onclick='show_textarea(this.slot)'>Risk Assessment Domains</button>
    								<button id='section_two_button' type='button' class='textarea_nav' slot=2 onclick='show_textarea(this.slot)'>Suicide</button>
    								<button id='section_three_button' type='button' class='textarea_nav' slot=3 onclick='show_textarea(this.slot)'>Self Harm</button>
    								<button id='section_four_button' type='button' class='textarea_nav' slot=4 onclick='show_textarea(this.slot)'>Harm Towards Others</button>
    								<button id='section_five_button' type='button' class='textarea_nav' slot=5 onclick='show_textarea(this.slot)'>Substance Use</button>
    								<button id='section_six_button' type='button' class='textarea_nav' slot=6 onclick='show_textarea(this.slot)'>Negative Coping Skills</button>
    							</nav>
    							<!-- TEXT TO SPEECH -->
    							<div id='SECTION_ONE' class="row mt-3">
    								<div class="col-md-12">
    									<label class="labels">Risk Assessment Domains</label>
    									<button id="dictate1" type='button' class='dictate_button' title='CLICK DICTATE'><i class="fa-solid fa-microphone"></i></button>
    									<button id="help_button" type='button' class='help_button' title='CLICK FOR HELP USING SPEECH TO TEXT'><i class="fa-solid fa-question fa-sm"></i></button>
    									<div id='HELP_DICTATE' hidden><small>
    										To utilize notes speech-to-text functionality, follow these steps:
											<ol>
												<li>Click the microphone button to start dictation.</li>
												<li>Speak clearly into the microphone.</li>
												<li>Pause briefly before vocalizing your desired punctuation, like "exclamation point," "question mark," "period," or "comma."</li>
												<li>Click the button again to stop dictating, the text will automatically correct itself, including sentence capitalization.</li>
												<li>You can start and stop as many times as needed, the text will not be deleted. Stop before continuing on to another textarea.</li>
											</ol>
                                        </small></div>
    									<textarea id="session_risk_assessment" name="session_risk_assessment" class="form-control" value=""></textarea>
    									<textarea id="session_risk_assessment_interim" name="session_risk_assessment_interim" class="form-control" value="" readonly></textarea>
    								</div>
    							</div>
    							<!-- TEXT TO SPEECH -->
    							<div id='SECTION_TWO' class="row mt-3" hidden>
    								<div class="col-md-12">
    									<label class="labels">Suicide</label>
    									<button id="dictate2" type='button' class='dictate_button'><i class="fa-solid fa-microphone"></i></button>
    									<textarea id="session_suicide" name="session_suicide" class="form-control" value=""></textarea>
    									<textarea id="session_suicide_interim" name="session_suicide_interim" class="form-control" value="" readonly></textarea>
    								</div>
    							</div>
    							<!-- TEXT TO SPEECH -->
    							<div id='SECTION_THREE' class="row mt-3" hidden>
    								<div class="col-md-12">
    									<label class="labels">Self Harm</label>
    									<button id="dictate3" type='button' class='dictate_button'><i class="fa-solid fa-microphone"></i></button>
    									<textarea id="session_self_harm" name="session_self_harm" class="form-control" value=""></textarea>
    									<textarea id="session_self_harm_interim" name="session_self_harm_interim" class="form-control" value="" readonly></textarea>
    								</div>
    							</div>
    							<!-- TEXT TO SPEECH -->
    							<div id='SECTION_FOUR' class="row mt-3" hidden>
    								<div class="col-md-12">
    									<label class="labels">Harm Towards Others</label>
    									<button id="dictate4" type='button' class='dictate_button'><i class="fa-solid fa-microphone"></i></button>
    									<textarea id="session_harm_others" name="session_harm_others" class="form-control" value=""></textarea>
    									<textarea id="session_harm_others_interim" name="session_harm_others_interim" class="form-control" value="" readonly></textarea>
    								</div>
    							</div>
    							<!-- TEXT TO SPEECH -->
    							<div id='SECTION_FIVE' class="row mt-3" hidden>
    								<div class="col-md-12">
    									<label class="labels">Substance Use</label>
    									<button id="dictate5" type='button' class='dictate_button'><i class="fa-solid fa-microphone"></i></button>
    									<textarea id="session_substance_use" name="session_substance_use" class="form-control" value=""></textarea>
    									<textarea id="session_substance_use_interim" name="session_substance_use_interim" class="form-control" value="" readonly></textarea>
    								</div>
    							</div>
    							<!-- TEXT TO SPEECH -->
    							<div id='SECTION_SIX' class="row mt-3" hidden>
    								<div class="col-md-12">
    									<label class="labels">Negative Coping Skills</label>
    									<button id="dictate6" type='button' class='dictate_button'><i class="fa-solid fa-microphone"></i></button>
    									<textarea id="session_negative_coping" name="session_negative_coping" class="form-control" value=""></textarea>
    									<textarea id="session_negative_coping_interim" name="session_negative_coping_interim" class="form-control" value="" readonly></textarea>
    								</div>
    							</div>
							</div>
							<!-- TX PLAN -->
							<div class="row mt-2">
								<div class="col-md-12">
									<label class="labels">Does this progress note require TX plan or 90 Day Review?</label>
									<select id="tx_plan_ninety_day" name="tx_plan_ninety_day" class="form-control" value="" onchange='update_plan(this.value);' required>
										<option value='' selected hidden disabled>SELECT</option>
										<option value=0>No</option>
										<option value=1>Yes</option>
									</select>
								</div>
							</div>
							<div id='other_plan_container' hidden>
    							<!-- Treatement Plan -->
    							<div class="row mt-2">
    								<div class="col-md-12">
    									<label class="labels">Was Treatement Plan reviewed with client?</label>
    									<select id="treatment_plan" name="treatment_plan" class="form-control" value="" onchange='update_treatment(this.value);'>
    										<option value='' selected hidden disabled>SELECT</option>
    										<option value=0>No</option>
    										<option value=1>Yes</option>
    									</select>
    								</div>
    							</div>
    							<div class="row mt-3">
    								<div class="col-md-12">
    									<label class="labels">Objective(s)</label>
    									<textarea id='session_objectives' name='session_objectives' class="form-control" value=""></textarea>
    								</div>
    							</div>
    							<div class="row mt-3">
    								<div class="col-md-12">
    									<label class="labels">Perscribed Interventions</label>
    									<textarea id='session_perscribed_interventions' name='session_perscribed_interventions' class="form-control" value=""></textarea>
    								</div>
    							</div>
							</div>
    						<br/>
							<!-- TEXT TO SPEECH TEXT AREA NAV2 -->
							<div id='nav_container_two'>
    							<nav id='section_nav2'>
    								<button id='nav2_button1' type='button' class='textarea_nav' slot=1 onclick='nav2_show_textarea(this.slot)'>Assessments</button>
    								<button id='nav2_button2' type='button' class='textarea_nav' slot=2 onclick='nav2_show_textarea(this.slot)'>Goals/Objectives</button>
    								<button id='nav2_button3' type='button' class='textarea_nav' slot=3 onclick='nav2_show_textarea(this.slot)'>Interventions</button>
    								<button id='nav2_button4' type='button' class='textarea_nav' slot=4 onclick='nav2_show_textarea(this.slot)'>Response</button>
    							</nav>
    							<!-- TEXT TO SPEECH -->
    							<div id='NAV2_SECTION1' class="row mt-3">
    								<div class="col-md-12">
    									<label class="labels">Assessments of mood, affect, behavior, medical condition(s), safe coping skills</label>
    									<button id="dictate2_1" type='button' class='dictate_button'><i class="fa-solid fa-microphone"></i></button>
    									<textarea id="session_assessments" name="session_assessments" class="form-control" value=""></textarea>
    									<textarea id="session_assessments_interim" name="session_assessments_interim" class="form-control" value="" readonly></textarea>
    								</div>
    							</div>
    							<!-- TEXT TO SPEECH -->
    							<div id='NAV2_SECTION2' class="row mt-3" hidden>
    								<div class="col-md-12">
    									<label class="labels">Person's report of progress towards goals/objectives since last session</label>
    									<button id="dictate2_2" type='button' class='dictate_button'><i class="fa-solid fa-microphone"></i></button>
    									<textarea id="session_goals" name="session_goals" class="form-control" value=""></textarea>
    									<textarea id="session_goals_interim" name="session_goals_interim" class="form-control" value="" readonly></textarea>
    								</div>
    							</div>
    							<!-- TEXT TO SPEECH -->
    							<div id='NAV2_SECTION3' class="row mt-3" hidden>
    								<div class="col-md-12">
    									<label class="labels">Interventions provided today</label>
    									<button id="dictate2_3" type='button' class='dictate_button'><i class="fa-solid fa-microphone"></i></button>
    									<textarea id="session_interventions" name="session_interventions" class="form-control" value=""></textarea>
    									<textarea id="session_interventions_interim" name="session_interventions_interim" class="form-control" value="" readonly></textarea>
    								</div>
    							</div>
    							<!-- TEXT TO SPEECH -->
    							<div id='NAV2_SECTION4' class="row mt-3" hidden>
    								<div class="col-md-12">
    									<label class="labels">Person's response to the intervention and progress towards goal(s)</label>
    									<button id="dictate2_4" type='button' class='dictate_button'><i class="fa-solid fa-microphone"></i></button>
    									<textarea id="session_response" name="session_response" class="form-control" value=""></textarea>
    									<textarea id="session_response_interim" name="session_response_interim" class="form-control" value="" readonly></textarea>
    								</div>
    							</div>
							</div>
							<div class="row mt-3">
								<div class="col-md-12">
									<label class="labels">Documentation Time Total</label><input id="documentation_time_total" name="documentation_time_total" type="text" class="form-control MASK_TIME" value="" onchange='log_documentation(this.value)' required>
								</div>
							</div><br/>
						</div>
					</div>
					<div class="col-md-4">
						<div class="p-3 py-5">
							<div class="d-flex justify-content-between align-items-center">
								<span>Appointment Note</span>
							</div>
							<br>
							<div class="col-md-12">
								<textarea id='appt_header' class="form-control" value="" rows=7 readonly></textarea>
							</div><br>
							<div class="col-md-12">
								<textarea id='appt_note' class="form-control" value="" rows=18 required></textarea>
							</div>
							<br>
						</div>
					</div>
					<div class="mt-5 text-center">
						<button class="btn btn-primary profile-button" type="submit">Save Record</button>
					</div>
					<div class="mt-5 text-center">
						<label></label>
					</div>
				</div>
			</div>
		</form>
	</div>
</div>