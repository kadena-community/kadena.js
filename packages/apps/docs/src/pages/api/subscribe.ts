import { isEmailValid } from '@/utils';
import mailchimp from '@mailchimp/mailchimp_marketing';
import { NextApiRequest, NextApiResponse } from 'next';

export interface IResponse<T> {
  status: number;
  message: string;
  body?: T;
}

const APIKEY: string = process.env.MAILCHIMP_API ?? '';
const SERVER_PREFIX: string = process.env.MAILCHIMP_SERVER_PREFIX ?? '';

const CreateResponse = (
  res: NextApiResponse<IResponse<{}>>,
  status: number,
  message: string,
): void => {
  res.status(500).json({
    status,
    message,
  });
  res.end();
};

mailchimp.setConfig({
  apiKey: APIKEY,
  server: SERVER_PREFIX,
});

const subscribe = async (
  req: NextApiRequest,
  res: NextApiResponse<IResponse<{}>>,
): Promise<void> => {
  if (req.method !== 'POST') {
    CreateResponse(res, 500, 'You can only use the method POST');
  }

  if (!APIKEY || !SERVER_PREFIX) {
    CreateResponse(res, 500, 'APIKEY AND SERVER_PREFIX missing');
  }

  const { email } = JSON.parse(req.body);
  if (!isEmailValid(email)) {
    CreateResponse(res, 500, 'Not a valid email address');
  }

  const response = await mailchimp.lists.getAllLists();
  if (!('lists' in response)) {
    CreateResponse(res, 500, 'Something went wrong, please try again later');
  } else if (response.lists.length === 0) {
    CreateResponse(res, 500, 'No Maillist found, sorry for the inconvenience');
  } else {
    const list = response.lists[0];

    let result;
    try {
      result = await mailchimp.lists.addListMember(list.id, {
        email_address: email,
        status: 'subscribed',
      });
    } catch (err) {
      if (
        err.status === 400 &&
        err.response.body.title.toLowerCase() === 'member exists'
      ) {
        CreateResponse(res, 200, 'Thank you for subscribing...again');
      }

      CreateResponse(res, 500, 'Something went wrong, please try again later');
    }

    if (typeof result?.status === 'number' && result.status > 400) {
      CreateResponse(res, 500, 'Something went wrong, please try again later');
    }

    CreateResponse(res, 200, 'Thank you for subscribing');
  }
};

export default subscribe;
