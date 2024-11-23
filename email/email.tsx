import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
  
interface RaycastMagicLinkEmailProps {
  magicLink?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

const RaycastMagicLinkEmail = ({
  magicLink,
}: RaycastMagicLinkEmailProps) => (
  <Html>
    <Head />
    <Preview>Connecte-toi avec ce lien magique.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`${baseUrl}/static/raycast-logo.png`}
          width={48}
          height={48}
          alt="Raycast"
        />
        <Heading style={heading}>🪄 Ton lien magique</Heading>
        <Section style={body}>
          <Text style={paragraph}>
            <Link style={link} href={magicLink}>
              👉 Clique ici pour te connecter 👈
            </Link>
          </Text>
          <Text style={paragraph}>
            Si tu n'as pas demandé ce lien, ignore cet email.
          </Text>
        </Section>
        <Text style={paragraph}>
          Best,
          <br />- L'équipe 404 Devinci x Celest
        </Text>
        <Hr style={hr} />
        <Img
          src={`${baseUrl}/static/raycast-logo.png`}
          width={32}
          height={32}
          style={{
            WebkitFilter: "grayscale(100%)",
            filter: "grayscale(100%)",
            margin: "20px 0",
          }}
        />
        <Text style={footer}>Advent Calendar 2024</Text>
        <Text style={footer}>La 404 Devinci x Celeste</Text>
      </Container>
    </Body>
  </Html>
);

RaycastMagicLinkEmail.PreviewProps = {
  magicLink: "https://raycast.com",
} as RaycastMagicLinkEmailProps;

export default RaycastMagicLinkEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 25px 48px",
  backgroundImage: 'url("/assets/raycast-bg.png")',
  backgroundPosition: "bottom",
  backgroundRepeat: "no-repeat, no-repeat",
};

const heading = {
  fontSize: "28px",
  fontWeight: "bold",
  marginTop: "48px",
};

const body = {
  margin: "24px 0",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
};

const link = {
  color: "#FF6363",
};

const hr = {
  borderColor: "#dddddd",
  marginTop: "48px",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  marginLeft: "4px",
};
  