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

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

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
      showMessage('success', 'Quiz created successfully!');
    } catch (error) {
      console.error('Error creating quiz:', error);
      showMessage('error', 'Error creating quiz. Please try again.');
    }
  };

  const handleUpdateQuiz = async () => {
    if (!editingQuiz) return;
    
    try {
      await updateDoc(doc(db, 'quizzes', editingQuiz.id), formData);
      onQuizzesUpdate();
      resetForm();
      showMessage('success', 'Quiz updated successfully!');
    } catch (error) {
      console.error('Error updating quiz:', error);
      showMessage('error', 'Error updating quiz. Please try again.');
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) return;
    
    try {
      await deleteDoc(doc(db, 'quizzes', quizId));
      onQuizzesUpdate();
      showMessage('success', 'Quiz deleted.');
    } catch (error) {
      console.error('Error deleting quiz:', error);
      showMessage('error', 'Error deleting quiz. Please try again.');
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
      showMessage('error', 'Please fill in all question fields');
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
      {/* Inline Message */}
      {message && (
        <div className={`rounded-xl px-4 py-3 text-sm font-medium ${
          message.type === 'success'
            ? 'bg-[rgba(0,255,136,0.1)] border border-[rgba(0,255,136,0.3)] text-[#00ff88]'
            : 'bg-red-500/10 border border-red-500/30 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-neutral-200 font-[family-name:var(--font-clash-display)]">Quiz Management</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn btn-primary"
        >
          + Create New Quiz
        </button>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="card">
          <h3 className="text-xl font-bold text-neutral-200 mb-6 font-[family-name:var(--font-clash-display)]">
            {editingQuiz ? 'Edit Quiz' : 'Create New Quiz'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="label-primary">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="input-primary"
                placeholder="Enter quiz title"
              />
            </div>
            
            <div>
              <label className="label-primary">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="select-primary"
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
              <label className="label-primary">Points</label>
              <input
                type="number"
                value={formData.points}
                onChange={(e) => setFormData(prev => ({ ...prev, points: parseInt(e.target.value) }))}
                className="input-primary"
                min="10"
                max="1000"
              />
            </div>
            
            <div>
              <label className="label-primary">Time Limit (minutes)</label>
              <input
                type="number"
                value={formData.timeLimit}
                onChange={(e) => setFormData(prev => ({ ...prev, timeLimit: parseInt(e.target.value) }))}
                className="input-primary"
                min="1"
                max="60"
              />
            </div>
            
            <div>
              <label className="label-primary">Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as 'easy' | 'medium' | 'hard' }))}
                className="select-primary"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="label-primary">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="textarea-primary"
              rows={3}
              placeholder="Enter quiz description"
            />
          </div>

          {/* Question Builder */}
          <div className="border-t border-[rgba(0,255,136,0.1)] pt-6">
            <h4 className="text-lg font-semibold text-neutral-200 mb-4 font-[family-name:var(--font-clash-display)]">Add Questions</h4>
            
            <div className="space-y-4 mb-4">
              <div>
                <label className="label-primary">Question</label>
                <input
                  type="text"
                  value={currentQuestion.question}
                  onChange={(e) => setCurrentQuestion(prev => ({ ...prev, question: e.target.value }))}
                  className="input-primary"
                  placeholder="Enter your question"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options.map((option, index) => (
                  <div key={index}>
                    <label className="label-primary">
                      Option {index + 1} {index === currentQuestion.correctAnswer && <span className="text-[#00ff88]">(Correct)</span>}
                    </label>
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...currentQuestion.options];
                        newOptions[index] = e.target.value;
                        setCurrentQuestion(prev => ({ ...prev, options: newOptions }));
                      }}
                      className="input-primary"
                      placeholder={`Enter option ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
              
              <div>
                <label className="label-primary">Correct Answer</label>
                <select
                  value={currentQuestion.correctAnswer}
                  onChange={(e) => setCurrentQuestion(prev => ({ ...prev, correctAnswer: parseInt(e.target.value) }))}
                  className="select-primary"
                >
                  {currentQuestion.options.map((_, index) => (
                    <option key={index} value={index}>Option {index + 1}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="label-primary">Explanation (Optional)</label>
                <textarea
                  value={currentQuestion.explanation}
                  onChange={(e) => setCurrentQuestion(prev => ({ ...prev, explanation: e.target.value }))}
                  className="textarea-primary"
                  rows={2}
                  placeholder="Explain why this is the correct answer"
                />
              </div>
              
              <button
                onClick={addQuestion}
                className="btn btn-primary"
              >
                Add Question
              </button>
            </div>

            {/* Questions List */}
            {formData.questions.length > 0 && (
              <div className="space-y-3">
                <h5 className="font-medium text-neutral-400">Questions ({formData.questions.length})</h5>
                {formData.questions.map((question, index) => (
                  <div key={question.id} className="bg-black/40 border border-[rgba(0,255,136,0.08)] p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-neutral-200">{index + 1}. {question.question}</p>
                        <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                          {question.options.map((option, optIndex) => (
                            <p key={optIndex} className={`${optIndex === question.correctAnswer ? 'text-[#00ff88] font-medium' : 'text-neutral-400'}`}>
                              {String.fromCharCode(65 + optIndex)}. {option}
                            </p>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => removeQuestion(question.id)}
                        className="text-red-400 hover:text-red-300 ml-4 transition-colors"
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
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              onClick={editingQuiz ? handleUpdateQuiz : handleCreateQuiz}
              disabled={!formData.title || !formData.category || formData.questions.length === 0}
              className="btn btn-primary"
            >
              {editingQuiz ? 'Update Quiz' : 'Create Quiz'}
            </button>
          </div>
        </div>
      )}

      {/* Quizzes List */}
      <div className="card">
        <div className="space-y-4">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="border border-[rgba(0,255,136,0.1)] rounded-xl p-4 hover:bg-[rgba(0,255,136,0.03)] transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-neutral-200">{quiz.title}</h3>
                    <span className={`badge ${
                      quiz.status === 'active' ? 'badge-success' :
                      quiz.status === 'draft' ? 'badge-info' :
                      'badge-warning'
                    }`}>
                      {quiz.status}
                    </span>
                    <span className={`badge ${
                      quiz.difficulty === 'easy' ? 'badge-success' :
                      quiz.difficulty === 'medium' ? 'badge-warning' :
                      'badge-danger'
                    }`}>
                      {quiz.difficulty}
                    </span>
                  </div>
                  <p className="text-neutral-400 mb-2">{quiz.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-neutral-500">
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
                    className="select-primary text-sm !py-1 !px-2"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <button
                    onClick={() => startEdit(quiz)}
                    className="text-[#00ffff] hover:text-[#67e8f9] p-1 transition-colors"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDeleteQuiz(quiz.id)}
                    className="text-red-400 hover:text-red-300 p-1 transition-colors"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
          {quizzes.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-xl font-semibold text-neutral-300 mb-2">No Quizzes Yet</p>
              <p className="text-neutral-500">Create your first quiz!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
