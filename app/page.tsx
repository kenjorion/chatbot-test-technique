import Chatbot from './components/Chatbot';

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-4xl">
        <Chatbot />
        <footer className="mt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} - Application Chatbot</p>
        </footer>
      </div>
    </div>
  );
}
