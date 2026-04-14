import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, subject, body, clientName } = req.body;

  if (!to || !subject || !body) {
    return res.status(400).json({ error: 'Missing required fields: to, subject, body' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(to)) {
    return res.status(400).json({ error: 'Invalid recipient email address' });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Juniors.Digital <hello@juniors.digital>',
      to: [to],
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
        </head>
        <body style="margin:0;padding:0;background:#f5f4f0;font-family:'Inter',system-ui,sans-serif;">
          <table role="presentation" style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:40px 20px;">
                <table role="presentation" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;border:1px solid #e0ddd8;overflow:hidden;">
                  <tr>
                    <td style="background:#0069b0;padding:24px 32px;">
                      <span style="font-size:18px;font-weight:700;color:#ffffff;letter-spacing:-0.02em;">Juniors.Digital</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:32px;">
                      ${clientName ? `<p style="margin:0 0 8px;font-size:14px;color:#6b6a65;">Hi ${clientName},</p>` : ''}
                      <div style="font-size:15px;line-height:1.7;color:#1a1814;white-space:pre-wrap;">${body.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:20px 32px;border-top:1px solid #e8e5e0;background:#f8f7f4;">
                      <p style="margin:0;font-size:12px;color:#6b6a65;">This message was sent from Juniors.Digital · <a href="https://juniors.digital" style="color:#0069b0;text-decoration:none;">juniors.digital</a></p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
      text: `${clientName ? `Hi ${clientName},\n\n` : ''}${body}\n\n---\nJuniors.Digital · https://juniors.digital`,
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ error: error.message || 'Failed to send email' });
    }

    return res.status(200).json({ success: true, id: data.id });
  } catch (err) {
    console.error('Unexpected error:', err);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}
