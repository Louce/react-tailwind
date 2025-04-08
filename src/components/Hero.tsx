const Hero = () => {
  return (
    <div className="relative bg-indigo-800">
      <div className="absolute inset-0">
        <img
          className="w-full h-full object-cover"
          src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80"
          alt="Team working on code"
        />
        <div className="absolute inset-0 bg-indigo-800 mix-blend-multiply" aria-hidden="true"></div>
      </div>
      <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Build beautiful websites with React & Tailwind
        </h1>
        <p className="mt-6 max-w-3xl text-xl text-indigo-100">
          Modern, responsive, and accessible components built with React and Tailwind CSS. Get started quickly with this powerful combination.
        </p>
        <div className="mt-10 flex space-x-4">
          <a
            href="#"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-700 bg-white hover:bg-indigo-50"
          >
            Get Started
          </a>
          <a
            href="#"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 bg-opacity-60 hover:bg-opacity-70"
          >
            Learn More
          </a>
        </div>
      </div>
    </div>
  );
};

export default Hero; 