import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Baseurl } from '../main';

const QuestionForm = ({ contestId, onComplete }) => {
  const [formData, setFormData] = useState({
    Question: '',
    Options: ['', '', '', ''],
    Answer: '',
    contestId: contestId, // Add contestId to the form data
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1); // For multi-step form
  const [answerIndex, setAnswerIndex] = useState(null); // To track which option is the answer

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'Options') {
      const updatedOptions = [...formData.Options];
      updatedOptions[parseInt(e.target.dataset.index)] = value;
      setFormData({ ...formData, Options: updatedOptions });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSetAnswer = (index) => {
    setAnswerIndex(index);
    setFormData({ ...formData, Answer: formData.Options[index] });
  };

  const nextStep = () => {
    if (step === 1 && !formData.Question.trim()) {
      toast.warning('Please enter a question before proceeding');
      return;
    }
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const validateForm = () => {
    // Check if all fields are filled
    if (!formData.Question.trim()) {
      toast.error('Please enter a question');
      return false;
    }

    // Check if all options have values
    const emptyOptions = formData.Options.some(option => !option.trim());
    if (emptyOptions) {
      toast.error('All options must have values');
      return false;
    }

    // Check if answer is selected
    if (!formData.Answer) {
      toast.error('Please select an answer');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
     
      const payload = {
        ...formData,
        contestId: contestId
      };
    console.log("payload of question",payload);
     const response= await axios.post(`${Baseurl}/post/addQuestion`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': localStorage.getItem("userId")
        },
        withCredentials: true,
      });
      // console.log("question",response)
      toast.success('Question added successfully!');
      
      // Reset form
      setFormData({
        Question: '',
        Options: ['', '', '', ''],
        Answer: '',
        contestId: contestId,
      });
      setAnswerIndex(null);
      setStep(1);
      
     
      if (onComplete) {
        setTimeout(() => {
          onComplete();
        }, 1000); 
      }
      
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'Failed to add the question. Please try again.');
    }

    setIsSubmitting(false);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 transition-all duration-300">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Step 1: Enter Your Question</h3>
            <div className="relative">
              <textarea
                name="Question"
                value={formData.Question}
                onChange={handleChange}
                className="w-full px-5 py-4 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-gray-700 text-lg resize-none min-h-[120px]"
                placeholder="Type your question here..."
                required
              />
              <div className="absolute bottom-3 right-3 text-sm text-gray-500">
                {formData.Question.length} characters
              </div>
            </div>
            <button
              onClick={nextStep}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-md"
            >
              Continue to Options
            </button>
          </div>
        );
      case 2:
        return (
          <div className="space-y-5 transition-all duration-300">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Step 2: Add Answer Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.Options.map((option, index) => (
                <div key={index} className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <input
                    type="text"
                    name="Options"
                    data-index={index}
                    value={option}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-gray-700"
                    placeholder={`Option ${index + 1}`}
                    required
                  />
                </div>
              ))}
            </div>
            <div className="flex space-x-4 pt-2">
              <button
                onClick={prevStep}
                className="w-1/2 bg-gray-500 text-white py-3 rounded-xl font-semibold hover:bg-gray-600 transition-all shadow-md"
              >
                Back
              </button>
              <button
                onClick={nextStep}
                className="w-1/2 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-md"
              >
                Set Correct Answer
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-5 transition-all duration-300">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Step 3: Select the Correct Answer</h3>
            <div className="space-y-3">
              {formData.Options.map((option, index) => (
                <div 
                  key={index}
                  onClick={() => handleSetAnswer(index)}
                  className={`p-4 rounded-xl cursor-pointer transition-all shadow-sm flex items-center ${
                    answerIndex === index 
                      ? 'bg-green-500 text-white' 
                      : 'bg-white hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    answerIndex === index 
                      ? 'bg-white text-green-700' 
                      : 'bg-indigo-100 text-indigo-700'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="font-medium">{option || `Option ${index + 1} (empty)`}</span>
                  {answerIndex === index && (
                    <svg className="w-6 h-6 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
            <div className="flex space-x-4 pt-2">
              <button
                onClick={prevStep}
                className="w-1/2 bg-gray-500 text-white py-3 rounded-xl font-semibold hover:bg-gray-600 transition-all shadow-md"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || answerIndex === null}
                className={`w-1/2 py-3 rounded-xl font-semibold transition-all shadow-md ${
                  isSubmitting || answerIndex === null
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </div>
                ) : (
                  'Submit Question'
                )}
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Progress indicator
  const ProgressBar = () => (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
      <div 
        className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
        style={{ width: `${(step / 3) * 100}%` }}
      ></div>
    </div>
  );

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress indicator */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm font-medium text-gray-500">Step {step} of 3</p>
        <div className="flex items-center space-x-2">
          <span className={`w-2.5 h-2.5 rounded-full ${step >= 1 ? 'bg-indigo-600' : 'bg-gray-300'}`}></span>
          <span className={`w-2.5 h-2.5 rounded-full ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-300'}`}></span>
          <span className={`w-2.5 h-2.5 rounded-full ${step >= 3 ? 'bg-indigo-600' : 'bg-gray-300'}`}></span>
        </div>
      </div>

      <ProgressBar />
      
      {renderStepContent()}
      
      {/* Preview Card */}
      {formData.Question && (
        <div className="mt-8 bg-gray-50 p-6 rounded-xl border border-gray-200 transition-all duration-300">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Question Preview</h3>
          <p className="text-gray-700 mb-4">{formData.Question}</p>
          
          {formData.Options.some(option => option) && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Options:</p>
              {formData.Options.map((option, index) => (
                option && (
                  <div key={index} className={`p-2 rounded ${
                    formData.Answer === option ? 'bg-green-100 border border-green-300' : 'bg-gray-50 border border-gray-200'
                  }`}>
                    <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                    {option}
                    {formData.Answer === option && (
                      <span className="ml-2 text-xs font-medium text-green-700">
                        (Correct Answer)
                      </span>
                    )}
                  </div>
                )
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionForm;