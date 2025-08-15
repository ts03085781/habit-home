export default async function TestPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  return (
    <div>
      <h1>Test Page</h1>
      <p>Current locale: {locale}</p>
      <p>This is a test page to verify routing is working.</p>
    </div>
  );
}