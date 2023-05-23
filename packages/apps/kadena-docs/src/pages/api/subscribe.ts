import { isEmailValid } from '@/utils';
import mailchimp from '@mailchimp/mailchimp_marketing';
import { NextApiRequest, NextApiResponse } from 'next';

interface IResponse<T> {
  status: number;
  message: string;
  body?: T;
}

const APIKEY: string = process.env.MAILCHIMP_API ?? '';
const SERVER_PREFIX: string = process.env.MAILCHIMP_SERVER_PREFIX ?? '';

mailchimp.setConfig({
  apiKey: APIKEY,
  server: SERVER_PREFIX,
});

const subscribe = async (
  req: NextApiRequest,
  res: NextApiResponse<IResponse<{}>>,
): Promise<void> => {
  if (req.method !== 'POST') {
    res.status(500).json({
      status: 500,
      message: 'You can only use the method POST',
    });
    res.end();
  }

  if (!APIKEY || !SERVER_PREFIX) {
    res.status(500).json({
      status: 500,
      message: 'APIKEY AND SERVER_PREFIX missing',
    });
    res.end();
  }

  const { email } = JSON.parse(req.body);
  if (!isEmailValid(email)) {
    res.status(500).json({
      status: 500,
      message: 'Not a valid email address',
    });
  }

  const { lists } = await mailchimp.lists.getAllLists();
  if (lists.length === 0) {
    res.status(500).json({
      status: 500,
      message: 'No Maillist found, sorry for the inconvenience',
    });
    res.end();
  }
  const list = lists[0];

  const result = await mailchimp.lists.addListMember(list.id, {
    email_address: email,
    status: 'subscribed',
  });

  if (result.statusCode > 400) {
    res.status(500).json({
      status: 500,
      message: 'Something went wrong, please try again later',
    });
    res.end();
  }

  res.status(500).json({
    status: 200,
    message: 'Thank you for subscribing',
  });
};

export default subscribe;
