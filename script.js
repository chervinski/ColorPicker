var colors = [];
var colorsString = document.cookie.match(/colors=([^;]*)/);
if (colorsString === null)
	colorsString = '';
else
{
	colorsString = colorsString[1];
	for (const colorString of colorsString.match(/[^\/]+/g)) {
		let color = {};
		let str = colorString.split('-');
		color.name = str[0];
		color.code = str[1];
		switch ((str[1].match(/,/g)||[]).length) {
			case 2:
				color.type = 'RGB';
				break;
			case 3:
				color.type = 'RGBA';
				break;
			case 0:
				color.type = 'HEX';
				break;
		}

		colors.push(color);
		appendColorBlock(color);
	}
}

function addColor(e) {
	e.preventDefault();
	let color = {
		name: document.getElementById('color-name').value,
		type: document.getElementById('color-type').value,
		code: document.getElementById('color-code').value
	};
	if (isColorValid(color))
	{
		colors.push(color);
		appendColorBlock(color);

		colorsString += color.name + '-' + color.code + '/';
		document.cookie = 'colors=' + colorsString + ';max-age=10800';
	}
}
function appendColorBlock(color) {
	let colorBlock = document.createElement('div');
	switch (color.type) {
		case 'RGB':
			colorBlock.style.backgroundColor = 'rgb(' + color.code + ')';
			break;
		case 'RGBA':
			colorBlock.style.backgroundColor = 'rgba(' + color.code + ')';
			break;
		case 'HEX':
			colorBlock.style.backgroundColor = color.code;
			break;
	}

	let info = document.createElement('div');
	info.className = 'color-info';

	let prop = document.createElement('div');
	prop.className = 'color-name';
	prop.innerText = color.name;
	info.appendChild(prop);

	prop = document.createElement('div');
	prop.className = 'color-type';
	prop.innerText = color.type;
	info.appendChild(prop);

	prop = document.createElement('div');
	prop.className = 'color-code';
	prop.innerText = color.code;
	info.appendChild(prop);

	colorBlock.appendChild(info);
	document.getElementById('colors-container').appendChild(colorBlock);
}
function isColorValid(color) {
	document.getElementById('error-color-name').innerText = '';
	document.getElementById('error-color-code').innerText = '';

	if (color.name.length > 16)
	{
		document.getElementById('error-color-name').innerText = 'too long';
		return false;
	}
	if (!/^\p{L}+$/u.test(color.name))
	{
		document.getElementById('error-color-name').innerText = 'can contain only letters';
		return false;
	}
	if (colors.findIndex(c => c.name === color.name) != -1)
	{
		document.getElementById('error-color-name').innerText = 'this name already exists';
		return false;
	}

	let regex;
	switch (color.type) {
		case 'RGB':
			regex = /^([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\s*,\s*([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\s*,\s*([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
			break;
		case 'RGBA':
			regex = /^([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\s*,\s*([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\s*,\s*([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\s*,\s*(0|1|0?.\d{1,10})$/;
			break;
		case 'HEX':
			regex = /^#[0-9a-fA-F]{6}$/;
			break;
	}
	if (!regex.test(color.code))
	{
		switch (color.type) {
			case 'RGB':
				regex = '[0-255],[0-255],[0-255]';
				break;
			case 'RGBA':
				regex = '[0-255],[0-255],[0-255],[0-1]';
				break;
			case 'HEX':
				regex = '\'#\' + 6 digits or letters (A-F)';
				break;
		}
		document.getElementById('error-color-code').innerText = regex;
		return false;
	}
	color.code = color.code.replace(/\s+/g, '');
	return true;
}
