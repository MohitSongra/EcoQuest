import React, { useState } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../services/firebase';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  status: 'active' | 'draft' | 'inactive';
  category: string;
  points: number;
  timeLimit: number; // in minutes
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: Date;
}

interface QuizManagerProps {
  quizzes: Quiz[];
  onQuizzesUpdate: () => void;
}

export default function QuizManager({ quizzes, onQuizzesUpdate }: QuizManagerProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    points: 100,
    timeLimit: 10,
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    questions: [] as Question[]
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: ''
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      points: 100,
      timeLimit: 10,
      difficulty: 'medium',
      questions: []
    });
    setCurrentQuestion({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    });
    setEditingQuiz(null);
    setShowCreateForm(false);
  };

  const handleCreateQuiz = async () => {
    try {
      const quizData = {
        ...formData,
        status: 'draft' as const,
        createdAt: new Date()
      };
      
      await addDoc(collection(db, 'quizzes'), quizData);
      onQuizzesUpdate();
      resetForm();
    } catch (error) {
      console.error('Error creating quiz:', error);
      alert('Error creating quiz. Please try again.');
    }
  };

  const handleUpdateQuiz = async () => {
    if (!editingQuiz) return;
    
    try {
      await updateDoc(doc(db, 'quizzes', editingQuiz.id), formData);
      onQuizzesUpdate();
      resetForm();
    } catch (error) {
      console.error('Error updating quiz:', error);
      alert('Error updating quiz. Please try again.');
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    if (!confirm('Are you sure you want to delete this quiz?')) return;
    
    try {
      await deleteDoc(doc(db, 'quizzes', quizId));
      onQuizzesUpdate();
    } catch (error) {
      console.error('Error deleting quiz:', error);
      alert('Error deleting quiz. Please try again.');
    }
  };

  const handleStatusChange = async (quizId: string, status: 'active' | 'draft' | 'inactive') => {
    try {
      await updateDoc(doc(db, 'quizzes', quizId), { status });
      onQuizzesUpdate();
    } catch (error) {
      console.error('Error updating quiz status:', error);
    }
  };

  const addQuestion = () => {
    if (!currentQuestion.question.trim() || currentQuestion.options.some(opt => !opt.trim())) {
      alert('Please fill in all question fields');
      return;
    }

    const newQuestion: Question = {
      id: Date.now().toString(),
      ...currentQuestion
    };

    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));

    setCurrentQuestion({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    });
  };

  const removeQuestion = (questionId: string) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
  };

  const startEdit = (quiz: Quiz) => {
    setEditingQuiz(quiz);
    setFormData({
      title: quiz.title,
      description: quiz.description,
      category: quiz.category,
      points: quiz.points,
      timeLimit: quiz.timeLimit,
      difficulty: quiz.difficulty,
      questions: quiz.questions
    });
    setShowCreateForm(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Quiz Management</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          + Create New Quiz
        </button>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            {editingQuiz ? 'Edit Quiz' : 'Create New Quiz'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter quiz title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select category</option>
                <option value="E-Waste Basics">E-Waste Basics</option>
                <option value="Recycling Methods">Recycling Methods</option>
                <option value="Environmental Impact">Environmental Impact</option>
                <option value="Technology">Technology</option>
                <option value="Sustainability">Sustainability</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Points</label>
              <input
                type="number"
                value={formData.points}
                onChange={(e) => setFormData(prev => ({ ...prev, points: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="10"
                max="1000"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Limit (minutes)</label>
              <input
                type="number"
                value={formData.timeLimit}
                onChange={(e) => setFormData(prev => ({ ...prev, timeLimit: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
                max="60"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as 'easy' | 'medium' | 'hard' }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Enter quiz description"
            />
          </div>

          {/* Question Builder */}
          <div className="border-t pt-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Add Questions</h4>
            
            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
                <input
                  type="text"
                  value={currentQuestion.question}
                  onChange={(e) => setCurrentQuestion(prev => ({ ...prev, question: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your question"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options.map((option, index) => (
                  <div key={index}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Option {index + 1} {index === currentQuestion.correctAnswer && '(Correct)'}
                    </label>
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...currentQuestion.options];
                        newOptions[index] = e.target.value;
                        setCurrentQuestion(prev => ({ ...prev, options: newOptions }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={`Enter option ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer</label>
                <select
                  value={currentQuestion.correctAnswer}
                  onChange={(e) => setCurrentQuestion(prev => ({ ...prev, correctAnswer: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {currentQuestion.options.map((_, index) => (
                    <option key={index} value={index}>Option {index + 1}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Explanation (Optional)</label>
                <textarea
                  value={currentQuestion.explanation}
                  onChange={(e) => setCurrentQuestion(prev => ({ ...prev, explanation: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                  placeholder="Explain why this is the correct answer"
                />
              </div>
              
              <button
                onClick={addQuestion}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Add Question
              </button>
            </div>

            {/* Questions List */}
            {formData.questions.length > 0 && (
              <div className="space-y-3">
                <h5 className="font-medium text-gray-700">Questions ({formData.questions.length})</h5>
                {formData.questions.map((question, index) => (
                  <div key={question.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{index + 1}. {question.question}</p>
                        <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                          {question.options.map((option, optIndex) => (
                            <p key={optIndex} className={`${optIndex === question.correctAnswer ? 'text-green-600 font-medium' : 'text-gray-600'}`}>
                              {String.fromCharCode(65 + optIndex)}. {option}
                            </p>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => removeQuestion(question.id)}
                        className="text-red-600 hover:text-red-700 ml-4"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={resetForm}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={editingQuiz ? handleUpdateQuiz : handleCreateQuiz}
              disabled={!formData.title || !formData.category || formData.questions.length === 0}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              {editingQuiz ? 'Update Quiz' : 'Create Quiz'}
            </button>
          </div>
        </div>
      )}

      {/* Quizzes List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="space-y-4">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="border border-gray-200 rounded-xl p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{quiz.title}</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      quiz.status === 'active' ? 'bg-green-100 text-green-800' :
                      quiz.status === 'draft' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {quiz.status}
                    </span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      quiz.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                      quiz.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {quiz.difficulty}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">{quiz.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>📚 {quiz.category}</span>
                    <span>❓ {quiz.questions?.length || 0} questions</span>
                    <span>🏆 {quiz.points} points</span>
                    <span>⏱️ {quiz.timeLimit} min</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <select
                    value={quiz.status}
                    onChange={(e) => handleStatusChange(quiz.id, e.target.value as 'active' | 'draft' | 'inactive')}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <button
                    onClick={() => startEdit(quiz)}
                    className="text-blue-600 hover:text-blue-700 p-1"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDeleteQuiz(quiz.id)}
                    className="text-red-600 hover:text-red-700 p-1"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
          {quizzes.length === 0 && (
            <p className="text-gray-500 text-center py-8">No quizzes found. Create your first quiz!</p>
          )}
        </div>
      </div>
    </div>
  );
}
