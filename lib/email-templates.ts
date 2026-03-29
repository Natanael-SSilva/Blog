interface ConfirmEmailProps {
  confirmUrl: string
  siteName: string
  unsubscribeUrl: string
}

export function confirmEmailTemplate({
  confirmUrl,
  siteName,
  unsubscribeUrl,
}: ConfirmEmailProps): string {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Confirme sua inscrição — ${siteName}</title>
</head>
<body style="margin:0;padding:0;background-color:#080e0a;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#080e0a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#0f1a11;border:1px solid #243028;border-radius:12px;overflow:hidden;">

          <!-- Linha dourada decorativa -->
          <tr>
            <td style="height:3px;background:linear-gradient(to right,transparent,#8b6914,#c9a84c,#8b6914,transparent);"></td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding:40px 40px 24px;text-align:center;border-bottom:1px solid #243028;">
              <p style="margin:0 0 8px;font-family:Georgia,serif;font-size:11px;letter-spacing:0.4em;text-transform:uppercase;color:#c9a84c;opacity:0.8;">✦ Newsletter</p>
              <h1 style="margin:0;font-family:Georgia,serif;font-size:26px;font-weight:700;color:#e8f0ea;letter-spacing:0.02em;">
                ${siteName}
              </h1>
            </td>
          </tr>

          <!-- Corpo -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 16px;font-size:18px;line-height:1.75;color:#e8f0ea;">
                Obrigado por se inscrever!
              </p>
              <p style="margin:0 0 32px;font-size:16px;line-height:1.75;color:#8fa896;">
                Clique no botão abaixo para confirmar seu email e começar a receber novos posts diretamente na sua caixa de entrada.
              </p>

              <!-- Botão CTA -->
              <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="background-color:#c9a84c;border-radius:6px;">
                    <a href="${confirmUrl}"
                       style="display:block;padding:14px 32px;font-family:Georgia,serif;font-size:14px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#080e0a;text-decoration:none;">
                      Confirmar inscrição
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:32px 0 0;font-size:13px;line-height:1.6;color:#5a7063;text-align:center;">
                Se você não solicitou esta inscrição, ignore este email.<br/>
                O link expira em 24 horas.
              </p>
            </td>
          </tr>

          <!-- Rodapé -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #243028;text-align:center;">
              <p style="margin:0;font-size:12px;color:#5a7063;">
                © ${new Date().getFullYear()} ${siteName} ·
                <a href="${unsubscribeUrl}" style="color:#5a7063;">Cancelar inscrição</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}

interface NewPostEmailProps {
  postTitle: string
  postExcerpt: string
  postUrl: string
  siteName: string
  unsubscribeUrl: string
}

export function newPostEmailTemplate({
  postTitle,
  postExcerpt,
  postUrl,
  siteName,
  unsubscribeUrl,
}: NewPostEmailProps): string {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${postTitle} — ${siteName}</title>
</head>
<body style="margin:0;padding:0;background-color:#080e0a;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#080e0a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#0f1a11;border:1px solid #243028;border-radius:12px;overflow:hidden;">

          <tr>
            <td style="height:3px;background:linear-gradient(to right,transparent,#8b6914,#c9a84c,#8b6914,transparent);"></td>
          </tr>

          <tr>
            <td style="padding:32px 40px 20px;border-bottom:1px solid #243028;">
              <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:#c9a84c;opacity:0.8;">✦ Nova publicação</p>
              <p style="margin:0;font-size:13px;color:#5a7063;">${siteName}</p>
            </td>
          </tr>

          <tr>
            <td style="padding:40px;">
              <h1 style="margin:0 0 20px;font-family:Georgia,serif;font-size:24px;font-weight:700;color:#e8f0ea;line-height:1.3;">
                ${postTitle}
              </h1>
              <p style="margin:0 0 32px;font-size:16px;line-height:1.8;color:#8fa896;">
                ${postExcerpt}
              </p>

              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color:#2d6a4f;border-radius:6px;">
                    <a href="${postUrl}"
                       style="display:block;padding:12px 28px;font-family:Georgia,serif;font-size:13px;letter-spacing:0.1em;text-transform:uppercase;color:#e8f0ea;text-decoration:none;">
                      Ler agora →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 40px;border-top:1px solid #243028;text-align:center;">
              <p style="margin:0;font-size:12px;color:#5a7063;">
                © ${new Date().getFullYear()} ${siteName} ·
                <a href="${unsubscribeUrl}" style="color:#5a7063;">Cancelar inscrição</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}
