function getCookie(name)
{
	var cookieArray = document.cookie.toString().split(';');
	for (var index = 0; index < cookieArray.length; index++)
	{
		if (cookieArray[index].indexOf(name) != -1)
		{
			return cookieArray[index].replace("name=", "").trim().replace(/\+/g, " ");
		}
	}
}

function formatDate(date, format)
{
	var monthList = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
	var dayList = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];
	
	var hour = date.getHours();
	var period = "AM";
	
	if (hour > 11)
	{
		hour = hour - 12;
		period = "PM";
	}
		
	return format.replace("%month", monthList[date.getMonth()]).replace("%day", dayList[date.getDay()]).replace("%year", date.getFullYear()).replace("%hour", hour).replace("%period", period).replace("%minute", (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()).replace("%second", date.getSeconds()).replace("%date", date.getDate());
}