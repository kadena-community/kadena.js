import { IResponse } from '@/types/ApiResponse';
import { isEmailValid } from '@/utils';
import mailchimp from '@mailchimp/mailchimp_marketing';
import { NextApiRequest, NextApiResponse } from 'next';

const APIKEY = process.env.MAILCHIMP_API;
const SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX;
mailchimp.setConfig({
  apiKey: APIKEY,
  server: SERVER_PREFIX,
});

export default async (req: NextApiRequest, res: NextApiResponse<IResponse>) => {
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

  const result = mailchimp.lists.addListMember(list.id, {
    email_address: email,
    status_if_new: 'pending',
    status: 'subscribed',
  });

  res.status(500).json({
    status: 200,
    message: 'Thank you for subscribing',
  });
};
