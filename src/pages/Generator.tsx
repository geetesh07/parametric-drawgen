
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ParametricForm, type ToolParameters } from "@/components/ParametricForm";
import { DrawingPreview } from "@/components/DrawingPreview";

const Generator = () => {
  const [generatedParams, setGeneratedParams] = useState<ToolParameters | null>(null);

  const handleGenerate = (params: ToolParameters) => {
    setGeneratedParams(params);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Parametric Drawing Generator</h1>
              <p className="text-muted-foreground">
                Enter tool specifications to generate a precision manufacturing drawing.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ParametricForm onGenerate={handleGenerate} />
              <DrawingPreview parameters={generatedParams} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Generator;
