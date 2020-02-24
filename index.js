'use strict';
const PCancelable = require('p-cancelable');

const action = PCancelable.fn(async ({config, convert, exportOptions, inputPath, outputPath}, onCancel) => {
	const {barHeight, barLocation, barColor} = config.store;
	const barY = barLocation === 'Top' ? `${barHeight}-H` : `H-${barHeight}`;

	const process = convert([
		'-i',
		inputPath,
		'-filter_complex',
		`[0]drawbox=h=ih:w=iw:t=fill:c=${barColor}[rectangle];[0][rectangle]overlay=x=-W+W*(t/${exportOptions.duration}):y=${barY}[output]`,
		'-map',
		'[output]',
		outputPath
	], 'Adding progress bar');

	onCancel(() => {
		process.cancel();
	});

	return process;
});

const config = {
	barHeight: {
		title: 'Height',
		type: 'number',
		minimum: 1,
		default: 5,
		required: true
	},
	barLocation: {
		title: 'Location',
		type: 'string',
		enum: ['Top', 'Bottom'],
		default: 'Top',
		required: true
	},
	barColor: {
		title: 'Color',
		customType: 'hexColor',
		required: true,
		default: '#007aff'
	}
};

const progressBar = {
	title: 'Progress Bar',
	config,
	action
};

exports.editServices = [progressBar];
