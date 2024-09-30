var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var StuDBName = "STUDENT-TABLE";
var StuRelationName = "SCHOOL-DB";
var connToken = "90931983|-31949224677444810|90962500";

$('#StuId').focus();

function saveRecNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}

function getStuIdAsJsonObj() {
    var StuId1 = $("#StuId").val();
    var jsonStr = {
        StuId: StuId1,
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var data = JSON.parse(jsonObj.data).record;
    $("#StuId").val(data.StuId);
    $("#StuName").val(data.StuName);
    $("#StuClass").val(data.StuClass);
    $("#StuBirthDate").val(data.StuBirthDate);
    $("#StuAddress").val(data.StuAddress);
    $("#StuEnrollment").val(data.StuEnrollment);
}

function resetForm() {
    $("#StuId").val("");
    $("#StuName").val("");
    $("#StuClass").val("");
    $("#StuBirthDate").val("");
    $("#StuAddress").val("");
    $("#StuEnrollment").val("");
    $("#StuId").prop("disabled", false);
    $("#StuSave").prop("disabled", true);
    $("#StuUpdate").prop("disabled", true);
    $("#StuReset").prop("disabled", true);
    $("#StuId").focus();
}

function saveStudent() {
    var jsonStr = validateAndGetFormData();
    if (jsonStr === "") {
        return;
    }
    var putReqStr = createPUTRequest(connToken, jsonStr, StuDBName, StuRelationName);
    jQuery.ajaxSetup({ async: false });
    var resultObj = executeCommandAtGivenBaseUrl(putReqStr, jpdbBaseURL, jpdbIML);
    alert(JSON.stringify(resultObj));
    jQuery.ajaxSetup({ async: true });
    resetForm();
    $("#StuId").focus();
}

function validateAndGetFormData() {
    var StuIdVar = $("#StuId").val();
    if (StuIdVar === "") {
        alert("Student Roll No is Required");
        $("#StuId").focus();
        return "";
    }
    var StuNameVar = $("#StuName").val();
    if (StuNameVar === "") {
        alert("Student Name is Required");
        $("#StuName").focus();
        return "";
    }
    var StuClassVar = $("#StuClass").val();
    if (StuClassVar === "") {
        alert("Student Class is Required");
        $("#StuClass").focus();
        return "";
    }
    var StuBirthDateVar = $("#StuBirthDate").val();
    if (StuBirthDateVar === "") {
        alert("Student Birth-Date is Required");
        $("#StuBirthDate").focus();
        return "";
    }
    var StuAddressVar = $("#StuAddress").val();
    if (StuAddressVar === "") {
        alert("Student Address is Required");
        $("#StuAddress").focus();
        return "";
    }
    var StuEnrollmentVar = $("#StuEnrollment").val();
    if (StuEnrollmentVar === "") {
        alert("Student Enrollment-Date is Required");
        $("#StuEnrollment").focus();
        return "";
    }
    var jsonStrObj = {
        StuId: StuIdVar,
        StuName: StuNameVar,
        StuClass: StuClassVar,
        StuBirthDate: StuBirthDateVar,
        StuAddress: StuAddressVar,
        StuEnrollment: StuEnrollmentVar,
    };
    return JSON.stringify(jsonStrObj);
}

function updateStudent() {
    $('#StuUpdate').prop('disabled', true);
    var jsonChg = validateAndGetFormData();
    if (jsonChg === "") return;
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, StuDBName, StuRelationName, localStorage.getItem('recno'));
    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({ async: true });
    console.log(resJsonObj);
    resetForm();
    $('StuId').focus();
}

function getStu() {
    var stuIdJsonObj = getStuIdAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, StuDBName, StuRelationName, stuIdJsonObj);
    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({ async: true });

    if (resJsonObj.status === 400) {
        $("#StuSave").prop("disabled", false);
        $("#StuReset").prop("disabled", false);
        $("#StuName").focus();
    } else if (resJsonObj.status === 200) {
        $("#StuId").prop("disabled", true);
        fillData(resJsonObj);
        $("#StuUpdate").prop("disabled", false);
        $("#StuReset").prop("disabled", false);
        $("#StuName").focus();
    }
}
