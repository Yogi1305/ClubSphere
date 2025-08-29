import React, { useState } from 'react';
import { X, CheckCircle, Circle, Trash2, Plus, Sparkles, Save, BookOpen } from 'lucide-react';
import { Baseurl } from '../main';
import axios from 'axios';
import { useRef } from 'react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

// AI Question Generator Modal Component
const AigeneratedQuestion = ({ isOpen, onClose, onSave ,contestId}) => {
  // Sample data structure for questions
  const [questions, setQuestions] = useState([]);

  const [number, setnumber] = useState(5);
  const [topic, settopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  
  // Generate new questions (simulate AI generation)
  const generateNewQuestions = async () => {
    setIsGenerating(true);
      const data={
        number,topic
      }
       try {
           const respomse=await axios.post(`${Baseurl}/generate`,data)
           console.log(respomse)
           setQuestions(respomse.data);
           setIsGenerating(false);
       } catch (error) {
        console.log("error ai generation",error)
        setIsGenerating(false);
        toast.error(error.response?.data?.message || 'Failed to generate questions. Please try again.');
       }
  };

  const handlesaveQ = async (index) => {
    console.log('Saving question:', questions[index]);
      try {
     const formm=questions[index]
      const payload = {
        ...formm,
        contestId: contestId
      };
      // console.log(payload)

     const response= await axios.post(`${Baseurl}/post/addQuestion`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': localStorage.getItem("userId1")
        },
        withCredentials: true,
      });
      // console.log("question",response)
      toast.success('Question added successfully!');
      
     
      
      
     
      
      
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'Failed to add the question. Please try again.');
    }
    
  };
  const modalRef = useRef(null);
//   useEffect(() => {
//   function handleClickOutside(event) {
//     if (modalRef.current && !modalRef.current.contains(event.target)) {
//       // console.log(modalRef.current.contains(event.target))
//       onClose();
//     }
//   }

//   if (isOpen) {
//     document.addEventListener("mousedown", handleClickOutside);
//   }

//   return () => {
//     document.removeEventListener("mousedown", handleClickOutside);
//   };
// }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" style={{ zIndex: 9999 }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden" ref={modalRef}>
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute right-6 top-6 hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X size={24} />
          </button>
          <div className="flex items-center gap-3">
            <Sparkles size={28} className="text-yellow-300" />
            <h2 className="text-2xl font-bold">AI Question Generator</h2>
          </div>
          <p className="text-purple-100 mt-2">Generate custom questions powered by AI</p>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Generation Form */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 mb-8 border border-blue-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Plus className="text-blue-600" size={20} />
              Generate New Questions
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Questions
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={number}
                  onChange={(e) => setnumber(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter number of questions"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Topic
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => settopic(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter topic (e.g., Science, History, Math)"
                />
              </div>
            </div>
            
            <button
              onClick={generateNewQuestions}
              disabled={isGenerating || !topic.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Generating Questions...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Generate Questions
                </>
              )}
            </button>
          </div>

          {/* Questions List */}
          {questions.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <CheckCircle className="text-green-600" size={24} />
                Generated Questions ({questions.length})
              </h3>
              
              <div className="space-y-6">
                {questions.map((set, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-lg font-semibold text-gray-800 flex-1 pr-4">
                        Q{index + 1}: {set.Question}
                      </h4>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handlesaveQ(index)}
                          className="bg-green-100 text-green-700 hover:bg-green-200 p-2 rounded-lg transition-colors"
                          title="Save Question"
                        >
                          <Save size={18} />
                          {/* <span>Add Question</span> */}
                        </button>
                       
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                      {set.Options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                            option === set.Answer
                              ? 'bg-green-50 border-green-300 text-green-800'
                              : 'bg-gray-50 border-gray-200 text-gray-700'
                          }`}
                        >
                          {option === set.Answer ? (
                            <CheckCircle size={18} className="text-green-600 flex-shrink-0" />
                          ) : (
                            <Circle size={18} className="text-gray-400 flex-shrink-0" />
                          )}
                          <span className="font-medium">{option}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-medium"> Answer:</span>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md font-semibold">
                          {set.Answer}
                        </span>
                      </div>
                      {set.difficulty && (
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          set.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                          set.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {set.difficulty}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};



export default AigeneratedQuestion;