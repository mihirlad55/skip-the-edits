/* global $ */

var lastScrollPosition = 0;

window.onscroll = function ()
{
	$("#header-main").css("position", "fixed");
	
	var scrollPositionDifference = lastScrollPosition - window.pageYOffset;
	var currentY = parseInt($("#header-main").css("top"));
	var minY = (parseInt($("#header-main").css("height"))*(-1));
	var maxY = 0;
	
	if (scrollPositionDifference > 0)
	{
		//$("#header-main").css("position", "fixed");
		//$("#header-main").css("top", (0 - lastScrollPosition - window.pageYOffset).toString() + "px");
		if (currentY < 0)
		{
			if (currentY + scrollPositionDifference > 0)
			{
				$("#header-main").css("top", "0px");
			}
			else
			{
				$("#header-main").css("top", (currentY + scrollPositionDifference).toString() + "px");
			}
		}
		
	}
	else if (scrollPositionDifference < 0)
	{
		if (currentY > minY)
		{
			if (currentY + scrollPositionDifference < minY)
			{
				$("#header-main").css("top", minY.toString() + "px");
			}
			else
			{
				$("#header-main").css("top", (currentY + scrollPositionDifference).toString() + "px");
			}
		}
		
	}
	
	$("#header-secondary").css("margin-top", Math.abs(currentY + minY).toString() + "px");

	
	lastScrollPosition = window.pageYOffset;
};
