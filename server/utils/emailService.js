const nodemailer = require("nodemailer");

/**
 * Parses date ("YYYY-MM-DD") and timeSlot ("11:00 AM" / "01:30 PM") in IST (UTC+5:30)
 * to UTC date strings for Google Calendar and iCal format: YYYYMMDDTHHmmssZ
 */
const parseSlotToUTC = (dateStr, timeSlot) => {
  try {
    const [year, month, day] = dateStr.split("-").map(Number);
    const match = timeSlot.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return null;

    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const period = match[3].toUpperCase();
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    // IST is UTC+5:30 -> subtract 5h 30m
    const istDate = new Date(Date.UTC(year, month - 1, day, hours, minutes));
    const utcStart = new Date(istDate.getTime() - (5 * 60 + 30) * 60 * 1000);
    const utcEnd = new Date(utcStart.getTime() + 45 * 60 * 1000); // 45-min appointment

    const toCalString = (d) =>
      d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

    return {
      startStr: toCalString(utcStart),
      endStr: toCalString(utcEnd),
    };
  } catch (err) {
    console.error("Error parsing slot for calendar:", err);
    return null;
  }
};

/**
 * Builds direct Google Calendar reservation URL
 */
const buildGoogleCalendarUrl = (appointment) => {
  const {
    bookingRef,
    clientName,
    clientPhone,
    clientEmail,
    sessionType,
    consultationFocus,
    date,
    timeSlot,
    notes,
  } = appointment;

  const slotUTC = parseSlotToUTC(date, timeSlot);
  const datesParam = slotUTC ? `${slotUTC.startStr}/${slotUTC.endStr}` : "";

  const title = `👑 VIP Saree Consultation: ${clientName} (${bookingRef})`;
  const details = [
    `✨ Ethnique VIP Saree Consultation`,
    `Reference: ${bookingRef}`,
    `Client: ${clientName}`,
    `Phone: +91 ${clientPhone}`,
    `Email: ${clientEmail}`,
    `Session: ${sessionType}`,
    `Focus: ${consultationFocus}`,
    notes ? `Requirements: "${notes}"` : ``,
    `---`,
    `Manage booking in Ethnique Admin: http://localhost:5173/admin/appointments`,
  ]
    .filter(Boolean)
    .join("\n");

  const location =
    sessionType === "In-Store Private Styling"
      ? "Jayant Saree Center Flagship Store, Main Market, India"
      : `WhatsApp Video Call (+91 73870 20612 / +91 ${clientPhone})`;

  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    title
  )}&dates=${datesParam}&details=${encodeURIComponent(
    details
  )}&location=${encodeURIComponent(location)}`;

  return url;
};

/**
 * Builds RFC 5545 standard .ics file content for blocking Outlook / Apple / Google Calendar
 */
const buildIcsContent = (appointment) => {
  const {
    bookingRef,
    clientName,
    clientPhone,
    sessionType,
    consultationFocus,
    date,
    timeSlot,
    notes,
  } = appointment;

  const slotUTC = parseSlotToUTC(date, timeSlot);
  const startStr = slotUTC?.startStr || "20260910T053000Z";
  const endStr = slotUTC?.endStr || "20260910T061500Z";

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Ethnique//VIP Saree Consultation//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${bookingRef}@ethnique.internal`,
    `DTSTAMP:${startStr}`,
    `DTSTART:${startStr}`,
    `DTEND:${endStr}`,
    `SUMMARY:👑 VIP Consultation - ${clientName} (${bookingRef})`,
    `DESCRIPTION:Client: ${clientName}\\nPhone: +91 ${clientPhone}\\nSession: ${sessionType}\\nFocus: ${consultationFocus}\\nNotes: ${notes || "None"}`,
    `LOCATION:${sessionType === "In-Store Private Styling" ? "Jayant Saree Center Flagship Store" : "WhatsApp Video Call (+91 73870 20612)"}`,
    "STATUS:CONFIRMED",
    "BEGIN:VALARM",
    "TRIGGER:-PT15M",
    "ACTION:DISPLAY",
    "DESCRIPTION:Reminder: Upcoming Ethnique VIP Consultation in 15 minutes",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
};

/**
 * Sends Email notification to Admin and Client with Calendar invite (.ics & Google Calendar link)
 */
const sendAppointmentNotification = async (appointment) => {
  const adminEmail = process.env.ADMIN_EMAIL || "theethnique26@gmail.com";
  const googleCalUrl = buildGoogleCalendarUrl(appointment);
  const icsContent = buildIcsContent(appointment);

  console.log(`\n=============================================================`);
  console.log(`[APPOINTMENT EMAIL NOTIFICATION ALERT]`);
  console.log(`To Admin: ${adminEmail}`);
  console.log(`Booking Ref: ${appointment.bookingRef}`);
  console.log(`Client: ${appointment.clientName} (+91 ${appointment.clientPhone})`);
  console.log(`Slot: ${appointment.date} @ ${appointment.timeSlot} (${appointment.sessionType})`);
  console.log(`Requirements: "${appointment.notes || appointment.consultationFocus}"`);
  console.log(`\n📅 Direct Calendar Block Link:`);
  console.log(googleCalUrl);
  console.log(`=============================================================\n`);

  // Check if SMTP is configured in environment
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    console.log(
      `[NOTE] To send automated live emails to ${adminEmail}, configure EMAIL_USER and EMAIL_PASS (Gmail App Password) in server/.env.`
    );
    return {
      sent: false,
      reason: "Missing EMAIL_USER/EMAIL_PASS in .env",
      googleCalUrl,
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    const htmlContent = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #FAF6F0; border: 1px solid #D4B483; border-radius: 16px; overflow: hidden; color: #2B2523;">
        <div style="background: linear-gradient(135deg, #6D1830, #8C2F4D); padding: 24px; text-align: center; color: #FAF6F0;">
          <h1 style="margin: 0; font-size: 24px; letter-spacing: 2px;">ETHNIQUE</h1>
          <p style="margin: 4px 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: #E5C583;">By Jayant Saree Center &bull; Private Client Concierge</p>
        </div>

        <div style="padding: 28px;">
          <div style="display: inline-block; background: #D4B48320; border: 1px solid #D4B483; color: #8C2F4D; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">
            👑 New VIP Consultation Reserved
          </div>
          <h2 style="margin: 0 0 16px; font-size: 20px; color: #6D1830;">A new client has reserved a consultation session!</h2>

          <div style="background: #FFFFFF; border: 1px solid #E8DFD3; border-radius: 12px; padding: 18px; margin-bottom: 20px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <tr>
                <td style="padding: 6px 0; color: #888;">Booking Reference:</td>
                <td style="padding: 6px 0; font-weight: bold; color: #6D1830; font-family: monospace; font-size: 14px;">${appointment.bookingRef}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #888;">Client Name:</td>
                <td style="padding: 6px 0; font-weight: bold;">${appointment.clientName}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #888;">Mobile (WhatsApp):</td>
                <td style="padding: 6px 0; font-weight: bold;">+91 ${appointment.clientPhone}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #888;">Email Address:</td>
                <td style="padding: 6px 0;">${appointment.clientEmail}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #888;">Session Format:</td>
                <td style="padding: 6px 0; font-weight: bold;">${appointment.sessionType}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #888;">Scheduled Date:</td>
                <td style="padding: 6px 0; font-weight: bold;">${appointment.date}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #888;">Time Slot:</td>
                <td style="padding: 6px 0; font-weight: bold; color: #8C2F4D;">${appointment.timeSlot} (IST)</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #888;">Consultation Focus:</td>
                <td style="padding: 6px 0;">${appointment.consultationFocus}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #888;">Client Requirements:</td>
                <td style="padding: 6px 0; font-style: italic; color: #6D1830;">"${appointment.notes || "None"}"</td>
              </tr>
            </table>
          </div>

          <!-- Action Buttons -->
          <div style="text-align: center; margin-top: 24px;">
            <a href="${googleCalUrl}" target="_blank" style="display: inline-block; background: #6D1830; color: #FAF6F0; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-right: 8px;">
              📅 Block in Google Calendar
            </a>
            <a href="https://wa.me/91${appointment.clientPhone.replace(/\D/g, "").slice(-10)}" target="_blank" style="display: inline-block; background: #059669; color: #FFFFFF; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
              💬 WhatsApp Client
            </a>
          </div>

          <p style="margin-top: 24px; font-size: 11px; color: #888; text-align: center;">
            Attached is the standard .ics calendar invite to automatically block this slot on Apple, Google, and Outlook calendars.
          </p>
        </div>
      </div>
    `;

    // 1. Send notification to Admin (theethnique26@gmail.com)
    await transporter.sendMail({
      from: `"Ethnique Concierge" <${emailUser}>`,
      to: adminEmail,
      subject: `👑 New VIP Consultation: ${appointment.clientName} (${appointment.date} @ ${appointment.timeSlot})`,
      html: htmlContent,
      icalEvent: {
        filename: `consultation_${appointment.bookingRef}.ics`,
        method: "REQUEST",
        content: icsContent,
      },
    });

    console.log(`[EMAIL SENT]: Successfully delivered appointment email to Admin (${adminEmail})`);

    // 2. If client provided a valid real email, send client confirmation with calendar invite
    const isRealClientEmail =
      appointment.clientEmail &&
      appointment.clientEmail.includes("@") &&
      !appointment.clientEmail.endsWith("@ethnique.client") &&
      !appointment.clientEmail.endsWith("@ethnique.concierge");

    if (isRealClientEmail) {
      const clientHtmlContent = `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #FAF6F0; border: 1px solid #D4B483; border-radius: 16px; overflow: hidden; color: #2B2523;">
          <div style="background: linear-gradient(135deg, #6D1830, #8C2F4D); padding: 24px; text-align: center; color: #FAF6F0;">
            <h1 style="margin: 0; font-size: 24px; letter-spacing: 2px;">ETHNIQUE</h1>
            <p style="margin: 4px 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: #E5C583;">By Jayant Saree Center &bull; Private Client Concierge</p>
          </div>

          <div style="padding: 28px;">
            <div style="display: inline-block; background: #D4B48320; border: 1px solid #D4B483; color: #8C2F4D; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">
              ✨ Consultation Confirmed
            </div>
            <h2 style="margin: 0 0 12px; font-size: 20px; color: #6D1830;">Dear ${appointment.clientName},</h2>
            <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6; color: #555;">
              We look forward to hosting your personalized saree styling session. Your appointment details are outlined below:
            </p>

            <div style="background: #FFFFFF; border: 1px solid #E8DFD3; border-radius: 12px; padding: 18px; margin-bottom: 20px;">
              <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                <tr>
                  <td style="padding: 6px 0; color: #888;">Booking Reference:</td>
                  <td style="padding: 6px 0; font-weight: bold; color: #6D1830; font-family: monospace;">${appointment.bookingRef}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #888;">Session Format:</td>
                  <td style="padding: 6px 0; font-weight: bold;">${appointment.sessionType}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #888;">Scheduled Date:</td>
                  <td style="padding: 6px 0; font-weight: bold;">${appointment.date}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #888;">Time Slot:</td>
                  <td style="padding: 6px 0; font-weight: bold; color: #8C2F4D;">${appointment.timeSlot} (IST)</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #888;">Focus:</td>
                  <td style="padding: 6px 0;">${appointment.consultationFocus}</td>
                </tr>
              </table>
            </div>

            <!-- Action Buttons -->
            <div style="text-align: center; margin-top: 24px;">
              <a href="${googleCalUrl}" target="_blank" style="display: inline-block; background: #6D1830; color: #FAF6F0; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-right: 8px;">
                📅 Add to Google Calendar
              </a>
              <a href="https://wa.me/917387020612?text=${encodeURIComponent(`Hello Ethnique Concierge! I have confirmed appointment ${appointment.bookingRef} for ${appointment.date} @ ${appointment.timeSlot}.`)}" target="_blank" style="display: inline-block; background: #059669; color: #FFFFFF; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
                💬 Message Concierge on WhatsApp
              </a>
            </div>

            <p style="margin-top: 24px; font-size: 11px; color: #888; text-align: center;">
              Open the attached .ics calendar file to sync this consultation directly to your phone's calendar.
            </p>
          </div>
        </div>
      `;

      try {
        await transporter.sendMail({
          from: `"Ethnique Concierge" <${emailUser}>`,
          to: appointment.clientEmail,
          subject: `✨ Your Ethnique Saree Consultation is Confirmed (${appointment.date} @ ${appointment.timeSlot})`,
          html: clientHtmlContent,
          icalEvent: {
            filename: `ethnique_consultation_${appointment.bookingRef}.ics`,
            method: "REQUEST",
            content: icsContent,
          },
        });
        console.log(`[EMAIL SENT]: Successfully delivered client confirmation to ${appointment.clientEmail}`);
      } catch (clientMailErr) {
        console.warn(`[CLIENT EMAIL NOTICE]: Could not deliver to client email:`, clientMailErr.message);
      }
    }

    return { sent: true, googleCalUrl };
  } catch (emailErr) {
    console.error("[EMAIL SEND ERROR]:", emailErr.message);
    return { sent: false, error: emailErr.message, googleCalUrl };
  }
};

module.exports = {
  buildGoogleCalendarUrl,
  buildIcsContent,
  sendAppointmentNotification,
};
