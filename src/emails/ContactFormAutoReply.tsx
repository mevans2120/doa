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
}

export const ContactFormAutoReply = ({
  name,
}: ContactFormAutoReplyProps) => {
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
              Hi {name},
            </Text>
            <Text style={paragraph}>
              Thank you for reaching out to Department of Art. We&apos;ve received your message and appreciate your interest in our services.
            </Text>
            <Text style={paragraph}>
              Our team will review your inquiry and get back to you within 24 hours. If your project requires immediate attention, please feel free to call us directly.
            </Text>
          </Section>

          <Section style={section}>
            <Heading style={h2}>What We Do</Heading>
            <Text style={paragraph}>
              Department of Art specializes in professional set construction for:
            </Text>
            <Text style={list}>
              • Film & Television Productions
            </Text>
            <Text style={list}>
              • Commercial Productions
            </Text>
            <Text style={list}>
              • Custom Prop Building
            </Text>
            <Text style={list}>
              • Design Consultation
            </Text>
          </Section>

          <Section style={section}>
            <Text style={paragraph}>
              In the meantime, feel free to explore our recent work at{' '}
              <Link href="https://departmentofart.com/projects" style={link}>
                our portfolio
              </Link>
              .
            </Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              Department of Art Productions
            </Text>
            <Text style={footerText}>
              6500 NE Portland Hwy, Portland, OR 97218
            </Text>
            <Text style={footerText}>
              Build • Destroy
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default ContactFormAutoReply

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
}

const h1 = {
  color: '#333',
  fontSize: '28px',
  fontWeight: '600',
  lineHeight: '40px',
  margin: '0 0 30px',
  padding: '0 48px',
  textAlign: 'center' as const,
}

const h2 = {
  color: '#333',
  fontSize: '20px',
  fontWeight: '600',
  lineHeight: '28px',
  margin: '20px 0 12px',
}

const section = {
  padding: '0 48px',
  marginBottom: '24px',
}

const paragraph = {
  color: '#525252',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px',
}

const list = {
  color: '#525252',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 8px',
  paddingLeft: '20px',
}

const link = {
  color: '#000000',
  textDecoration: 'underline',
}

const footer = {
  borderTop: '1px solid #e6ebf1',
  marginTop: '40px',
  padding: '32px 48px 0',
  textAlign: 'center' as const,
}

const footerText = {
  color: '#8898aa',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0 0 4px',
}