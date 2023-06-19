import { Schema, model } from 'mongoose';
import { urlInterface } from '../../types/url.types';
import { v4 as uuidv4 } from 'uuid';

const urlSchema = new Schema<urlInterface>({
	id: {
		type: String,
		required: true,
		default: uuidv4(),
	},
	url: {
		type: String,
		required: true,
	},
	short_url_id: {
		type: String,
		required: true,
	},
	processed_url: {
		type: String,
		required: true,
	},
	date_created: {
		type: Date,
		required: true,
		default: Date.now(),
	},
});

export const url_model = model<urlInterface>('Url', urlSchema);
