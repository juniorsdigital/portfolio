export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-5xl w-full">
        <h1 className="text-4xl font-bold mb-4">John Swanson</h1>
        <p className="text-xl mb-2">Creator, Designer, and Web Designer</p>
        <p className="text-gray-600">
          For inquiries please contact{" "}
          <a
            href="mailto:johnreidswanson@gmail.com"
            className="text-blue-600 hover:underline"
          >
            johnreidswanson@gmail.com
          </a>
        </p>
      </div>
    </main>
  );
}
