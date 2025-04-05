import {
  Tailwind,
  Html,
  Body,
  Head,
  Heading,
  Container,
  Section,
  Text,
  Preview,
  Link,
} from "@react-email/components";
import { render } from "@react-email/render";

type EmailHTMLReturnTypes = {
  html: (otp?: string) => Promise<string>;
  text: string;
};

export const generateEmailComponents = ({
  url,
  host,
}: {
  url: string;
  host: string;
}): EmailHTMLReturnTypes => {
  return {
    html: async (otp?: string) =>
      render(
        <Tailwind>
          <Html>
            <Head />
            <Preview>Sign in to Portal Berita</Preview>
            <Body className="bg-white text-center font-sans">
              <Container className="mx-auto mt-5 w-full max-w-md rounded-lg border border-gray-300 bg-white p-12">
                <Text className="text-center text-lg font-bold">
                  Portal Berita
                </Text>
                <Heading className="text-center">
                  Your Authentication Code
                </Heading>

                <Section className="mx-auto my-4 w-[280px] rounded-md bg-black/5">
                  <Heading className="m-0 py-2 text-center text-[32px] leading-[40px] font-bold tracking-[6px] text-black">
                    {otp}
                  </Heading>
                </Section>
                <Text>{url}</Text>
                <Text className="text-center text-red-500">Reminder:</Text>
                <Text className="m-0 px-10 text-center tracking-normal text-gray-700">
                  This code is valid for 1 minutes. Please do not share this
                  code with anyone.
                </Text>
                <Text className="m-0 px-10 text-center tracking-normal text-gray-700">
                  Not expecting this email?
                </Text>
                <Text className="m-0 px-10 text-center tracking-normal text-gray-700">
                  Contact{" "}
                  <Link
                    href="mailto:support@jobaccepted.com"
                    className="text-gray-700 underline"
                  >
                    support@jobaccepted.com
                  </Link>{" "}
                  if you did not request this code.
                </Text>
              </Container>
            </Body>
          </Html>
        </Tailwind>,
      ),

    text: `Sign in to ${host}\n\n${url}\n\n If you did not request this email, you can safely ignore it.`,
  };
};
