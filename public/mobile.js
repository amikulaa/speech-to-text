/**
 * Onload, focus on patient name
 */
$(document).ready(function(){
	document.getElementById("patient_name").focus();
	$('.MASK_TIME').mask("00:00", {placeholder: "00:00"});
});

/**
 * Patient name on change, clean page
 */
$('#patient_name').on('change', function () {
	var patient_name = this.value;
	document.getElementById("dat_form").reset();
	reset_header_vars();
	$('#patient_name').val(patient_name);
	log_patientname(patient_name);
});

/**
 * Patient name on input, finding results
 */
$('#patient_name').on('input', function () {
	var cleaned_name = removeTags(this.value);
	$('#patient_name').val(cleaned_name);
});

/**
 * This function is checking for inputted tags and strips them off 
 * for security
 */
function removeTags(str) {
	if(str == null || str == ''){
		return '';
	} else {
		str = str.toString();
	}
    return str.replace( /(<([^>]+)>)/ig, '');
}

/**
 * Main appt note on change, clean
 */
$('#appt_note').on('change', function () {
	$('#appt_note').val(removeTags(this.value));
});

/**
 * session_objectives note on change, clean
 */
$('#session_objectives').on('change', function () {
	$('#session_objectives').val(removeTags(this.value));
});

/**
 * session_interventions note on change, clean
 */
$('#session_perscribed_interventions').on('change', function () {
	$('#session_perscribed_interventions').val(removeTags(this.value));
});

/**
 * This function cleans the output before being in the final script, 
 * and adds capitlization and formatting to the output
 */
function clean_final_transcript(final_transcript){
	var punctuation = [".", "?", "!"];
	for(var p = 0; p < punctuation.length; p++){
		var cleaned = final_transcript.split(punctuation[p]);
		for(var i = 0; i < cleaned.length; i++){
			var temp = cleaned[i].trim();
			cleaned[i] = (temp.substring(0, 1)).toUpperCase();
			cleaned[i] += temp.substring(1);
		}
		final_transcript = cleaned.join(punctuation[p] + ' ');
	}
	return removeTags(final_transcript);
}

/**
 * On load, this function gets called for all the dictate
 * areas with the dictate button ID and result textarea ID 
 * to add eventlisteners for when user dictates
 */
function add_events_dictate(button_id, result_id){
  	var button = document.getElementById(button_id);
  	var result = document.getElementById(result_id);
  	var final_transcript = "";
	const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  	if (typeof SpeechRecognition === "undefined") {
		 button.remove();
		 const message = document.getElementById("message");
		 message.removeAttribute("hidden");
		 message.setAttribute("aria-hidden", "false");
  	} else {
		let listening = false;
		var recognition = new SpeechRecognition();  
		const start = () => {
			 recognition.start();
			 button.style.backgroundColor = "#FB3640";
			 button.style.color = "#FFFFFF";
			 button.innerHTML = '<i class="fa-solid fa-microphone-slash"></i>';
			 button.classList.add('pulse');
		};
		const stop = () => {
			$('#' + result_id).val(clean_final_transcript($('#' + result_id).val()) + ' ');
		    final_transcript = $('#' + result_id).val();
	      	recognition.stop();
			button.style.backgroundColor = "#A9D8B8";
			button.classList.remove('pulse');
	      	button.innerHTML = '<i class="fa-solid fa-microphone"></i>';
	    };
	    /** onresult fires EVERY registered/recognition of a word */
	    const onResult = event => {
			let interim_transcript = "";
			final_transcript = $('#' + result_id).val();
		    for (let i = event.resultIndex; i < event.results.length; ++i) {
				var new_value = event.results[i][0].transcript;
				/** punctuation */
				if(new_value.trim() == 'comma'){
					new_value = ',';
				} else if(new_value.trim() == 'open parentheses' || new_value.trim() == 'open parenthesis'){
					new_value = '(';
				} else if(new_value.trim() == 'close parentheses' || new_value.trim() == 'close parenthesis'){
					new_value = ')';
				} else if(new_value.trim() == 'colon'){
					new_value = ':';
				} else if(new_value.trim() == 'semicolon'){
					new_value = ';';
				} else if(new_value.trim() == 'open quotation' || new_value.trim() == 'open quote'){
					new_value = ' "';
				} else if(new_value.trim() == 'close quotation' || new_value.trim() == 'close quote'){
					new_value = '"';
				} else if(new_value.trim() == 'period'){
					new_value = '.';
				} else if(new_value.trim() == 'question mark'){
					new_value = '?';
				} else if(new_value.trim() == 'exclamation' || new_value.trim() == 'exclamation point'){
					new_value = '!';
				}
				/** add result to final transcript IF is result, intermim results go to interim textarea */
		      	if (event.results[i].isFinal) {
		        	final_transcript += new_value;
		      	} else {
		        	interim_transcript += new_value;
		      	}
		    }
		    /** final text */
		    $('#' + result_id).val(final_transcript);
		    (document.getElementById(result_id)).dispatchEvent(new Event('input'));
		    /** interim text */
		    $('#' + result_id + '_interim').val(interim_transcript);
		    (document.getElementById(result_id + '_interim')).dispatchEvent(new Event('input'));
		};
		
		recognition.continuous = true;
  		recognition.interimResults = true;
		recognition.addEventListener('result', onResult);
		button.addEventListener("click", () => {
			listening ? stop() : start();
			listening = !listening;
		});
		result.addEventListener("change", () => {
			$('#' + result_id).val(removeTags($('#' + result_id).val()));
		});
	}	
}

/** add speech to text listeners with 6 paragraphs */
window.addEventListener("DOMContentLoaded", () => {
	var textareas = [
		["dictate1", "session_risk_assessment"], 
		["dictate2", "session_suicide"],
		["dictate3", "session_self_harm"],
		["dictate4", "session_harm_others"],
		["dictate5", "session_substance_use"],
		["dictate6", "session_negative_coping"],
		["dictate2_1", "session_assessments"],
		["dictate2_2", "session_goals"],
		["dictate2_3", "session_interventions"],
		["dictate2_4", "session_response"]];
	for(var i = 0; i < textareas.length; i++) {
        add_events_dictate(textareas[i][0], textareas[i][1]);
	}
});

/**
 * Variables used for forming the note header
 * saved into header to be used when processing saving
 * the actual appointment note
 * 
 * Creates the header onupdate of vars associated within it
 */
var header = '';
var patient_name = '';
var today = new Date().toJSON().slice(0, 10);
var date = today;
var start_time = '';
var end_time = '';
var total_time = '';
var method = "";
var client_loc = "";
var tx_plan = "";
var treatment = "";
var time_docu = "";
function get_header(){
	var str_builder = 'PATIENT: ' + patient_name + '\n';
	str_builder += '[' + date + '][' + start_time + ' - ' + end_time + '][' + total_time + ']\n';
	switch(method){
		case "0":
			str_builder += '[In Person]\n';
			break;
		case "1":
			str_builder += '[Video/Audio]\n';
			switch(client_loc){
				case "0":
					str_builder += '[Client Home]\n';
					break;
				case "1":
					str_builder += '[Client NOT Home]\n';
					break;
			}
			break;
		case "2":
			str_builder += '[Audio Only]\n';
			break;
	}
	str_builder += tx_plan == "1" ? '[TX Plan or 90 Day Review]\n' : '';
	str_builder += treatment == "1" ? '[Treatment Reviewed]\n' : '';
	str_builder += '[Documentation Time: ' + time_docu + ']';
	header = str_builder;
	document.getElementById('appt_header').textContent = header;
}

/**
 * Re-initialize variables on patient name change
 */
function reset_header_vars(){
	header = '';
	patient_name = '';
	today = new Date().toJSON().slice(0, 10);
	date = today;
	start_time = '';
	end_time = '';
	total_time = '';
	method = "";
	client_loc = "";
	tx_plan = "";
	treatment = "";
	time_docu = "";
}
/**
 * This function logs the patient name used for note creation
 */
function log_patientname(patient){
	patient_name = patient;
	get_header();
}

/**
 * This function logs the documentation time
 */
function log_documentation(documentation){
	time_docu = documentation;
	get_header();
}

/**
 * This function logs the end time
 */
function log_patientdate(curr_value){
	switch(curr_value){
		case "0":
			//today
			date = today;
			break;
		case "1":
			date = today;
			//today
			break;
		case "2":
			//yesterday
			let d = new Date();
  			d.setDate(d.getDate() - 1);
  			date = d.toISOString().split('T')[0];
			break;
	}
	get_header();
}

/**
 * This function changes the total time based off of start time and end time
 */
function check_total_time(){
	if(start_time != '' && end_time != ''){
		/** get date start date */
		var start_date = new Date();
		start_date.setHours(start_time.split(':')[0]);
		start_date.setMinutes(start_time.split(':')[1]);
		/** get date end date */
		var end_date = new Date();
		end_date.setHours(end_time.split(':')[0]);
		end_date.setMinutes(end_time.split(':')[1]);
		/** total time set */
		var diff = end_date.getTime() - start_date.getTime();
    	var hours = Math.floor(diff / 1000 / 60 / 60);
    	diff -= hours * 1000 * 60 * 60;
    	var minutes = Math.floor(diff / 1000 / 60);
     	var output = ((hours < 9 && hours >= 0) ? "0" : "") + hours + ":" + (minutes < 9 ? "0" : "") + minutes;
     	if(parseInt(output) < 0){
			document.getElementById('error_msg').value = 'ERROR: TIME END BEFORE TIME START';
			document.getElementById('session_end').value = null;
			document.getElementById('session_time_total').value = '00:00';
			log_patienttotal('00:00');
		} else {
			document.getElementById('error_msg').value = '';
			document.getElementById('session_time_total').value = output;
			log_patienttotal(output);
		}
	}
}

/**
 * This function logs the start time
 */
function log_patientstart(value){
	start_time = value;
	check_total_time();
	get_header();
}

/**
 * This function logs the end time
 */
function log_patientend(value){
	end_time = value;
	check_total_time();
	get_header();
}

/**
 * This function logs the total
 */
function log_patienttotal(value){
	total_time = value;
	get_header();
}

/**
 * This function updates the appointment note based off of the method
 * their session was completed in 
 * [0 => in person, 1 => video/audio, 2 => audio only]
 */
function update_method_note(new_value){
	let note = document.getElementById('appt_note');
	note.textContent = '';
	document.getElementById('tx_plan_ninety_day').value = '';
	document.getElementById('treatment_plan').value = '';
	document.getElementById('client_location').value = '';
	document.getElementById('travel_time').value = '';
	document.getElementById('travel_mileage').value = '';
	document.getElementById('other_plan_container').hidden = true;
	switch(new_value){
		case "0":
			method = "0";
			note.textContent += 'Today\'s session was completed in person.';
			document.getElementById('client_location_container').hidden = true;
			document.getElementById('travel_mileage_container').hidden = false;
			document.getElementById('client_location').required = false;
			document.getElementById('travel_time').required = true;
			document.getElementById('travel_mileage').required = true;
			break;
		case "1":
			method = "1";
			note.textContent += 'Reviewed telehealth service options during today\'s session. Today\'s session was conducted via audio-visual telehealth. Due to consumer preference, the session was conducted via audio-visual.';
			document.getElementById('client_location_container').hidden = false;
			document.getElementById('travel_mileage_container').hidden = true;
			document.getElementById('client_location').required = true;
			document.getElementById('travel_time').required = false;
			document.getElementById('travel_mileage').required = false;
			break;
		case "2":
			method = "2";
			note.textContent += 'Reviewed telehealth service options during today\'s session. Due to consumer preference or technology limitations, the session was conducted via audio only.';
			document.getElementById('client_location_container').hidden = false;
			document.getElementById('travel_mileage_container').hidden = true;
			document.getElementById('client_location').required = true;
			document.getElementById('travel_time').required = false;
			document.getElementById('travel_mileage').required = false;
			break;
	}
	get_header();
}

/**
 * This function updates the appointment note based off of 
 * where the client was location if NOT in person
 * [0 => at home, 1 => not at home]
 */
function update_client_note(new_value){
	let note = document.getElementById('appt_note');
	var curr_start = (note.textContent).split('\n\n')[0];
	document.getElementById('tx_plan_ninety_day').value = '';
	document.getElementById('treatment_plan').value = '';
	document.getElementById('other_plan_container').hidden = true;
	if(curr_start != '' && curr_start != null){
		note.textContent = curr_start;
	}
	switch(new_value){
		case "0":
			client_loc = "0";
			note.textContent += '\n\nClient was located at their home during the session.';
			break;
		case "1":
			client_loc = "1";
			note.textContent += '\n\nClient was NOT located at their home during the session.';
			break;
	}
	get_header();
}

/**
 * UPDATES TX PLAN UPDATES or 90 day
 */
function update_plan(new_value){
	let note = document.getElementById('appt_note');
	var curr_start = (note.textContent).split('\n\nClinic Review Due Date')[0];
	document.getElementById('treatment_plan').value = '';
	if(curr_start != '' && curr_start != null){
		note.textContent = curr_start;
	}
	switch(new_value){
		case "0":
			tx_plan = "0";
			document.getElementById('other_plan_container').hidden = true;
			document.getElementById('treatment_plan').required = false;
			break;
		case "1":
			tx_plan = "1";
			document.getElementById('other_plan_container').hidden = false;
			document.getElementById('treatment_plan').required = true;
			note.textContent += '\n\nClinic Review Due Date \n\nTreatment Plan Review Date';
			break;
	}
	get_header();
}

/**
 * UPDATES treatment
 */
function update_treatment(new_value){
	let note = document.getElementById('appt_note');
	var curr_start = (note.textContent).split('\n\nThe Treatment Plan')[0];
	if(curr_start != '' && curr_start != null){
		note.textContent = curr_start;
	}
	switch(new_value){
		case "0":
			treatment = "0";
			note.textContent += '\n\nThe Treatment Plan was NOT reviewed with the client.';
			break;
		case "1":
			treatment = "1";
			note.textContent += '\n\nThe Treatment Plan was reviewed with the client.';
			break;
	}
	get_header();
}

var section_textarea = 
{SECTION_ONE: "session_risk_assessment", 
SECTION_TWO : "session_suicide",
SECTION_THREE : "session_self_harm",
SECTION_FOUR : "session_harm_others",
SECTION_FIVE : "session_substance_use",
SECTION_SIX : "session_negative_coping",
NAV2_SECTION1 : "session_assessments",
NAV2_SECTION2 :  "session_goals",
NAV2_SECTION3 : "session_interventions",
NAV2_SECTION4 : "session_response"};
		
/**
 * Checks if textarea has text
 */
function textarea_completed(section_id){
	if(section_textarea[section_id] != null){
		if($('#' + section_textarea[section_id]).val() != ''){
			return true;
		}
	}
	return false;
}

/**
 * This function switches nav1
 */
var last_section = 'SECTION_ONE';
var last_nav = 'section_one_button';
function show_textarea(curr_section){
	if(textarea_completed(last_section)){
		document.getElementById(last_nav).style.backgroundColor = '#143642';
		document.getElementById(last_nav).style.color = '#ffffff';
	} else {
		document.getElementById(last_nav).style.backgroundColor = '#ffffff';
		document.getElementById(last_nav).style.color = '#788498';
	}
	document.getElementById(last_section).hidden = true;
	switch(curr_section){
		case "1":
			last_section = 'SECTION_ONE';
			last_nav = 'section_one_button';
			break;
		case "2":
			last_section = 'SECTION_TWO';
			last_nav = 'section_two_button';
			break;
		case "3":
			last_section = 'SECTION_THREE';
			last_nav = 'section_three_button';
			break;
		case "4":
			last_section = 'SECTION_FOUR';
			last_nav = 'section_four_button';
			break;
		case "5":
			last_section = 'SECTION_FIVE';
			last_nav = 'section_five_button';
			break;
		case "6":
			last_section = 'SECTION_SIX';
			last_nav = 'section_six_button';
			break;
	}
	//show and highlight new section
	document.getElementById(last_section).hidden = false;
	document.getElementById(last_nav).style.backgroundColor = '#788498';
	document.getElementById(last_nav).style.color = '#ffffff';
}
show_textarea("1");

/**
 * This function switches nav2
 */
var nav2_last_section = 'NAV2_SECTION1';
var nav2_last_nav = 'nav2_button1';
function nav2_show_textarea(curr_section){
	if(textarea_completed(nav2_last_section)){
		document.getElementById(nav2_last_nav).style.backgroundColor = '#143642';
		document.getElementById(nav2_last_nav).style.color = '#ffffff';
	} else {
		document.getElementById(nav2_last_nav).style.backgroundColor = '#ffffff';
		document.getElementById(nav2_last_nav).style.color = '#788498';
	}
	document.getElementById(nav2_last_section).hidden = true;
	switch(curr_section){
		case "1":
			nav2_last_section = 'NAV2_SECTION1';
			nav2_last_nav = 'nav2_button1';
			break;
		case "2":
			nav2_last_section = 'NAV2_SECTION2';
			nav2_last_nav = 'nav2_button2';
			break;
		case "3":
			nav2_last_section = 'NAV2_SECTION3';
			nav2_last_nav = 'nav2_button3';
			break;
		case "4":
			nav2_last_section = 'NAV2_SECTION4';
			nav2_last_nav = 'nav2_button4';
			break;
	}
	//show and highlight new section
	document.getElementById(nav2_last_section).hidden = false;
	document.getElementById(nav2_last_nav).style.backgroundColor = '#788498';
	document.getElementById(nav2_last_nav).style.color = '#ffffff';
}
nav2_show_textarea("1");

/**
 * This oninput change textarea height
 */
function OnInput() {
  this.style.height = 0;
  this.style.height = (this.scrollHeight) + "px";
}

/**
 * This function auto-resizes the textarea
 */
window.addEventListener("DOMContentLoaded", () => {
	const tx = document.getElementsByTagName("textarea");
	for (let i = 0; i < tx.length; i++) {
  		tx[i].setAttribute("style", "height:" + (tx[i].scrollHeight) + "px;overflow-y:hidden;");
  		tx[i].addEventListener("input", OnInput, false);
	}
});

/** 
 * Generates the time for the clock on tabs
 */
function currentTime() {
  let date = new Date(); 
  let hh = date.getHours();
  let mm = date.getMinutes();
  let ss = date.getSeconds();
  let session = "AM";

  if(hh === 0){
      hh = 12;
  }
  if(hh > 12){
      hh = hh - 12;
      session = "PM";
  }

   hh = (hh < 10) ? "0" + hh : hh;
   mm = (mm < 10) ? "0" + mm : mm;
   ss = (ss < 10) ? "0" + ss : ss;
    
   let time = hh + ":" + mm + ":" + ss + " " + session;

  document.getElementById("clock").innerText = time; 
  let t = setTimeout(function(){ currentTime() }, 1000);
}
currentTime();

/**
 * Show informational div onclick of help button or hide
 */
$('.help_button').on('click', function (){
	if(document.getElementById('HELP_DICTATE').hidden == false){
		document.getElementById('HELP_DICTATE').hidden = true;
	} else {
		document.getElementById('HELP_DICTATE').hidden = false;
	}
});