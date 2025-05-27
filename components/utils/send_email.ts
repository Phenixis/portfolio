import { User } from '@/lib/db/schema';
import axios from 'axios';

export async function sendEmail(to: string, subject: string, htmlContent: string) {
    const apiUrl = process.env.RESEND_API_ENDPOINT;
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiUrl) {
        throw new Error('API endpoint is missing');
    }
    if (!apiKey) {
        throw new Error('API key is missing');
    }

    const html = htmlContent.includes("<html>") ? htmlContent : `<html><body>${htmlContent}</body></html>`;

    try {
        const response = await axios.post(apiUrl, {
            to,
            subject,
            html
        }, {
            headers: {
                'x-api-key': apiKey,
                'Content-Type': 'application/json'
            }
        });

        if (response.status !== 200) {
            throw new Error(`Failed to send email: ${response.statusText}`);
        }

        return response.data;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

export async function sendWelcomeEmail(user: User, password: string) {
    const emailContent = `
            <html>
            <head>
            <style>
            body {
                background-color: #f3f4f6;
                margin: 0;
                font-family: Arial, sans-serif;
            }
            main {
                max-width: 768px;
                width: 100%;
                margin: 20px auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            h1 {
                font-size: 1.5rem;
                font-weight: bold;
                color: #000000;
                margin-bottom: 16px;
                text-align: center;
            }
            h2 {
                font-size: 1.25rem;
                font-weight: 600;
                color: #374151;
                margin-top: 16px;
            }
            h3 {
                font-size: 1.125rem;
                font-weight: 500;
                color: #4b5563;
                margin-top: 8px;
            }
            ul {
                list-style-type: disc;
                padding-left: 20px;
                margin: 0;
            }
            li {
                color: #1f2937;
                margin-bottom: 8px;
            }
            @media (max-width: 600px) {
                main {
                    padding: 10px;
                }
                h1 {
                    font-size: 1.25rem;
                }
                h2 {
                    font-size: 1rem;
                }
                h3 {
                    font-size: 0.875rem;
                }
                ul {
                    padding-left: 15px;
                }
                li {
                    font-size: 0.875rem;
                }
            }
            </style>
            </head>
            <body>
            <main>
            <h1>Welcome</h1>
            <h2>Your account has been created, here are your credentials</h2>
            <p>These credentials are unique and this is the only time you will see them, please save them in a secure location.</p>
            <p>Identifier: ${user.id}</p>
            <p>Password: ${password}</p>
            <p>You can now login to the app <a href="${process.env.NEXT_PUBLIC_APP_URL}/login">here</a></p>
            <p>If you have any questions, please contact us at <a href="mailto:max@maximeduhamel.com">max@maximeduhamel.com</a></p>
            <p>Thank you again for your trust.</p>
            <p>Best regards,</p>
            <p>Maxime Duhamel</p>
            </main>
            </body>
            </html>
        `;

    await sendEmail(user.email, "Welcome to the app", emailContent);

    const emailContent2 = `
            <html>
            <head>
            <style>
            body {
                background-color: #f3f4f6;
                margin: 0;
                font-family: Arial, sans-serif;
            }
            main {
                max-width: 768px;
                width: 100%;
                margin: 20px auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            h1 {
                font-size: 1.5rem;
                font-weight: bold;
                color: #000000;
                margin-bottom: 16px;
                text-align: center;
            }
            h2 {
                font-size: 1.25rem;
                font-weight: 600;
                color: #374151;
                margin-top: 16px;
            }
            h3 {
                font-size: 1.125rem;
                font-weight: 500;
                color: #4b5563;
                margin-top: 8px;
            }
            ul {
                list-style-type: disc;
                padding-left: 20px;
                margin: 0;
            }
            li {
                color: #1f2937;
                margin-bottom: 8px;
            }
            @media (max-width: 600px) {
                main {
                    padding: 10px;
                }
                h1 {
                    font-size: 1.25rem;
                }
                h2 {
                    font-size: 1rem;
                }
                h3 {
                    font-size: 0.875rem;
                }
                ul {
                    padding-left: 15px;
                }
                li {
                    font-size: 0.875rem;
                }
            }
            </style>
            </head>
            <body>
            <main>
            <h1>Hey !</h1>
            <h2>${user.first_name} ${user.last_name} just created an account on your application</h2>
            <p>You can send them an email at this address: <a href="mailto:${user.email}">${user.email}</a></p>
            <p>Best regards,</p>
            <p>Maxime Duhamel</p>
            </main>
            </body>
            </html>
        `;
    
    sendEmail("max@maximeduhamel.com", "Someone created an account on your portfolio !", emailContent2);
}