var error1 = true;
var error2 = true;
var error3 = true;

function displayerror(x, y) {
    if (x === true) {
        document.getElementById(y).style.display = 'block';
    }
}

function checkemail() {

}

function checklength(x) {
    if (x.value.length < 6 && x.value.length > 0) {
        error2 = true;
    } else {
        document.getElementById('error2').style.display = 'none';
        error2 = false;
    }
}

function checkmatch(x) {
    if (document.getElementById("cpassword").value != document.getElementById("password").value) {
        error3 = true;
    } else {
        document.getElementById('error3').style.display = 'none';
        error3 = false;
    }
}

function checkall() {
    if ((error2 === true) || (error3 === true)) {
        document.getElementById('next').disabled = true;
    } else {
        document.getElementById('next').disabled = false;
    }
}