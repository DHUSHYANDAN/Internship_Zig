import React from 'react';

const SignIn = () => {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen pt-6">
      <div className="w-full bg-white rounded-lg shadow border sm:max-w-md p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-4">Sign In</h1>
        <form className="space-y-4" method="POST">
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email</label>
            <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="johndoe@example.com" required />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
            <input type="password" name="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="••••••••" required />
          </div>
          <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Sign In</button>
          <p className="text-sm  text-gray-700">Don't have an account? <a className="font-medium text-blue-600 hover:underline" href="/signup">Sign up here</a></p>
        </form>
      </div>
    </section>
  );
};

export default SignIn;
