export default async function SimplePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  return (
    <div>
      <h1>Simple Page</h1>
      <p>Locale: {locale}</p>
      <p>This is a minimal test page</p>
    </div>
  );
}