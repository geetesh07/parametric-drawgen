
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">About ParametricDraw</h1>
            
            <div className="prose dark:prose-invert max-w-none">
              <p className="lead mb-6 text-lg text-muted-foreground">
                ParametricDraw is a specialized web application designed to generate production-ready 
                manufacturing drawings based on user-input parameters. Our tool streamlines the 
                process of creating technical drawings for manufacturing tooling.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
              <p>
                To simplify the process of creating precise manufacturing drawings for tooling 
                professionals, engineers, and manufacturers with an intuitive and powerful 
                parametric drawing generator.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Features</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Parametric input for tool specifications</li>
                <li>Support for various tool types (endmills, drills, reamers)</li>
                <li>Accurate dimensional representation</li>
                <li>Customizable drawing templates (coming soon)</li>
                <li>Export options for manufacturing documentation</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Future Development</h2>
              <p>
                We are continuously working to enhance ParametricDraw with new features and capabilities:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Advanced template customization</li>
                <li>Additional tool types and specifications</li>
                <li>Proposal drawing generation</li>
                <li>User accounts and drawing history</li>
                <li>Collaboration tools for teams</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
              <p>
                Have questions or feedback? We'd love to hear from you. Contact our team at 
                <a href="mailto:info@parametricdraw.com" className="text-primary underline ml-1">
                  info@parametricdraw.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
