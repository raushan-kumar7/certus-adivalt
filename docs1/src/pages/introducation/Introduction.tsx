const Introduction = () => {
  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Introduction</h1>
      <div className="prose prose-blue">
        <p className="text-lg text-gray-700 mb-4">
          Welcome to the documentation for our routing implementation. This guide covers all aspects of our routing system including types, constants, and various utilities.
        </p>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <p className="text-blue-700">
            Use the sidebar to navigate through different sections of the documentation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Introduction;