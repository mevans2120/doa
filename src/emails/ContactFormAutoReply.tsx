import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface ContactFormAutoReplyProps {
  name: string
  emailSettings?: {
    autoReply?: {
      subject?: string
      greeting?: string
      mainMessage?: string
      responseTime?: string
      servicesIntro?: string
      services?: string[]
      closingMessage?: string
      signature?: string
    }
    footer?: {
      contactInfo?: {
        phone?: string
        email?: string
        website?: string
        address?: string
      }
      tagline?: string
    }
  }
}

export const ContactFormAutoReply = ({
  name,
  emailSettings,
}: ContactFormAutoReplyProps) => {
  // Use CMS data or fall back to defaults
  const settings = emailSettings?.autoReply || {}
  const footer = emailSettings?.footer || {}
  
  const greeting = settings.greeting || 'Hi'
  const mainMessage = settings.mainMessage || 'Thank you for reaching out to Department of Art. We\'ve received your message and appreciate your interest in our services.'
  const responseTime = settings.responseTime || 'Our team will review your inquiry and get back to you within 24-48 hours. If your project requires immediate attention, please feel free to call us directly.'
  const servicesIntro = settings.servicesIntro || 'Department of Art specializes in professional set construction for:'
  const services = settings.services || [
    'Film & Television Productions',
    'Commercial & Advertising Campaigns',
    'Custom Prop Building & Fabrication',
    'Set Design & Construction',
    'Production Design Consultation'
  ]
  const closingMessage = settings.closingMessage || 'We look forward to discussing how we can bring your creative vision to life with our expertise in production design and set construction.'
  const signature = settings.signature || 'Best regards,\nThe Department of Art Team'
  
  // Footer contact info
  const contactInfo = footer.contactInfo || {}
  const phone = contactInfo.phone || '(503) 555-0100'
  const email = contactInfo.email || 'info@departmentofart.com'
  const website = contactInfo.website || 'https://departmentofart.com'
  const address = contactInfo.address || 'Department of Art Productions\n6500 NE Portland Hwy\nPortland, OR 97218'
  const tagline = footer.tagline || 'Build • Destroy'

  const previewText = 'Thank you for contacting Department of Art'

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Thank You for Contacting Us</Heading>
          
          <Section style={section}>
            <Text style={paragraph}>
              {greeting} {name},
            </Text>
            <Text style={paragraph}>
              {mainMessage}
            </Text>
            <Text style={paragraph}>
              {responseTime}
            </Text>
          </Section>

          <Section style={section}>
            <Heading style={h2}>What We Do</Heading>
            <Text style={paragraph}>
              {servicesIntro}
            </Text>
            {services.map((service: string, index: number) => (
              <Text key={index} style={list}>
                • {service}
              </Text>
            ))}
          </Section>

          <Section style={section}>
            <Text style={paragraph}>
              {closingMessage}
            </Text>
            <Text style={paragraph}>
              {signature.split('\n').map((line: string, index: number) => (
                <span key={index}>
                  {line}
                  {index < signature.split('\n').length - 1 && <br />}
                </span>
              ))}
            </Text>
          </Section>

          <Section style={footerStyle}>
            <Heading style={h3}>Contact Information</Heading>
            <Text style={footerText}>
              <strong>Phone:</strong> {phone}
            </Text>
            <Text style={footerText}>
              <strong>Email:</strong> {email}
            </Text>
            <Text style={footerText}>
              <strong>Website:</strong>{' '}
              <Link href={website} style={link}>
                {website}
              </Link>
            </Text>
            <Text style={footerText}>
              <strong>Address:</strong><br />
              {address.split('\n').map((line: string, index: number) => (
                <span key={index}>
                  {line}
                  {index < address.split('\n').length - 1 && <br />}
                </span>
              ))}
            </Text>
            <Text style={taglineStyle}>
              {tagline}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#f4f4f4',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 20px',
  borderRadius: '8px',
  maxWidth: '600px',
  marginTop: '20px',
  marginBottom: '20px',
}

const h1 = {
  color: '#710000',
  fontSize: '28px',
  fontWeight: '700',
  textAlign: 'center' as const,
  margin: '0 0 30px',
}

const h2 = {
  color: '#333333',
  fontSize: '22px',
  fontWeight: '600',
  margin: '30px 0 15px',
}

const h3 = {
  color: '#333333',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 15px',
}

const section = {
  marginBottom: '30px',
}

const paragraph = {
  color: '#555555',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 15px',
}

const list = {
  color: '#555555',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 8px',
  paddingLeft: '10px',
}

const footerStyle = {
  borderTop: '2px solid #710000',
  marginTop: '40px',
  paddingTop: '30px',
}

const footerText = {
  color: '#666666',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0 0 8px',
}

const link = {
  color: '#710000',
  textDecoration: 'none',
}

const taglineStyle = {
  color: '#710000',
  fontSize: '14px',
  fontWeight: '600',
  textAlign: 'center' as const,
  marginTop: '20px',
  letterSpacing: '2px',
  textTransform: 'uppercase' as const,
}

export default ContactFormAutoReply