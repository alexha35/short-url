import express from 'express';
import turl from 'turl';
import validUrl from 'valid-url';

import { url_model } from '../models/url.model';
import { urlInterface } from '../../types/url.types';

export const urlRouter = express.Router();

urlRouter.get('/:url', async (req, res) => {
	const { url } = req.params;

	try {
		if (url) {
			const findURL = await url_model.findOne<urlInterface>({ short_url_id: url });
			findURL ? res.status(301).redirect(findURL.url) : res.status(404).send('Url not found');
		} else {
			res.status(404).json({ error: `Not found` });
		}
	} catch (error) {
		res.status(400).json(error);
	}
});

urlRouter.post('/process-url', async (req, res) => {
	const req_url = req.body.url;
	const isValidUrl = validUrl.isWebUri(req_url);
	const find_url = await url_model.findOne<urlInterface>({ url: req_url });

	if (!find_url && isValidUrl) {
		try {
			const short_url_id = await turl.shorten(req_url);
			const new_url = new url_model({
				url: req_url,
				short_url_id: short_url_id.replace('https://tinyurl.com/', ''),
				processed_url: `${req.protocol}://${req.get('host')}/url/${short_url_id.replace(
					'https://tinyurl.com/',
					''
				)}`,
			});

			const saved_url = await new_url.save();
			res.status(200).json({ sucess: true, data: saved_url });
		} catch (error) {
			res.status(400).json(error);
		}
	} else {
		isValidUrl && find_url
			? res.status(200).json({ sucess: true, data: find_url })
			: res.status(400).json({ error: `${req_url} is not valid url` });
	}
});
