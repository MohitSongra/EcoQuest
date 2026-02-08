import { 
  Quiz, 
  Question, 
  Challenge, 
  Reward, 
  User, 
  QuizSubmission,
  ValidationResult,
  ValidationError 
} from '../types';

export class ValidationService {
  
  // Email validation
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  // Points validation
  static isValidPoints(points: number): boolean {
    return typeof points === 'number' && points >= 0 && Number.isInteger(points);
  }

  // Question validation
  static validateQuestion(question: Question): ValidationResult {
    const errors: ValidationError[] = [];

    if (!question.question || question.question.trim().length === 0) {
      errors.push({ field: 'question', message: 'Question text is required' });
    }

    if (!question.options || question.options.length < 2) {
      errors.push({ field: 'options', message: 'At least 2 options are required' });
    } else {
      // Check if all options are valid
      question.options.forEach((option, index) => {
        if (!option || option.trim().length === 0) {
          errors.push({ field: `options[${index}]`, message: `Option ${index + 1} is required` });
        }
      });
    }

    if (typeof question.correctAnswer !== 'number' || 
        question.correctAnswer < 0 || 
        question.correctAnswer >= question.options.length) {
      errors.push({ field: 'correctAnswer', message: 'Valid correct answer index is required' });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Quiz validation
  static validateQuiz(quiz: Quiz): ValidationResult {
    const errors: ValidationError[] = [];

    if (!quiz.title || quiz.title.trim().length === 0) {
      errors.push({ field: 'title', message: 'Quiz title is required' });
    }

    if (!quiz.description || quiz.description.trim().length === 0) {
      errors.push({ field: 'description', message: 'Quiz description is required' });
    }

    if (!quiz.questions || quiz.questions.length === 0) {
      errors.push({ field: 'questions', message: 'At least one question is required' });
    } else {
      // Validate each question
      quiz.questions.forEach((question, index) => {
        const questionValidation = this.validateQuestion(question);
        if (!questionValidation.isValid) {
          questionValidation.errors.forEach(error => {
            errors.push({ 
              field: `questions[${index}].${error.field}`, 
              message: error.message 
            });
          });
        }
      });
    }

    if (!['active', 'draft', 'inactive'].includes(quiz.status)) {
      errors.push({ field: 'status', message: 'Invalid quiz status' });
    }

    if (!quiz.category || quiz.category.trim().length === 0) {
      errors.push({ field: 'category', message: 'Quiz category is required' });
    }

    if (!this.isValidPoints(quiz.points)) {
      errors.push({ field: 'points', message: 'Valid points value is required' });
    }

    if (typeof quiz.timeLimit !== 'number' || quiz.timeLimit <= 0) {
      errors.push({ field: 'timeLimit', message: 'Time limit must be greater than 0' });
    }

    if (!['easy', 'medium', 'hard'].includes(quiz.difficulty)) {
      errors.push({ field: 'difficulty', message: 'Invalid difficulty level' });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Challenge validation
  static validateChallenge(challenge: Challenge): ValidationResult {
    const errors: ValidationError[] = [];

    if (!challenge.title || challenge.title.trim().length === 0) {
      errors.push({ field: 'title', message: 'Challenge title is required' });
    }

    if (!challenge.description || challenge.description.trim().length === 0) {
      errors.push({ field: 'description', message: 'Challenge description is required' });
    }

    if (!this.isValidPoints(challenge.points)) {
      errors.push({ field: 'points', message: 'Valid points value is required' });
    }

    if (!['active', 'pending', 'inactive'].includes(challenge.status)) {
      errors.push({ field: 'status', message: 'Invalid challenge status' });
    }

    if (!challenge.category || challenge.category.trim().length === 0) {
      errors.push({ field: 'category', message: 'Challenge category is required' });
    }

    if (!['easy', 'medium', 'hard'].includes(challenge.difficulty)) {
      errors.push({ field: 'difficulty', message: 'Invalid difficulty level' });
    }

    if (!challenge.requirements || challenge.requirements.length === 0) {
      errors.push({ field: 'requirements', message: 'At least one requirement is needed' });
    }

    if (typeof challenge.estimatedTime !== 'number' || challenge.estimatedTime <= 0) {
      errors.push({ field: 'estimatedTime', message: 'Estimated time must be greater than 0' });
    }

    if (!challenge.creator || challenge.creator.trim().length === 0) {
      errors.push({ field: 'creator', message: 'Challenge creator is required' });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Reward validation
  static validateReward(reward: Reward): ValidationResult {
    const errors: ValidationError[] = [];

    if (!reward.title || reward.title.trim().length === 0) {
      errors.push({ field: 'title', message: 'Reward title is required' });
    }

    if (!reward.description || reward.description.trim().length === 0) {
      errors.push({ field: 'description', message: 'Reward description is required' });
    }

    if (!['coupon', 'discount', 'cashback', 'voucher'].includes(reward.type)) {
      errors.push({ field: 'type', message: 'Invalid reward type' });
    }

    if (!this.isValidPoints(reward.pointsCost)) {
      errors.push({ field: 'pointsCost', message: 'Valid points cost is required' });
    }

    if (typeof reward.value !== 'number' || reward.value <= 0) {
      errors.push({ field: 'value', message: 'Reward value must be greater than 0' });
    }

    if (!['fixed', 'percentage'].includes(reward.valueType)) {
      errors.push({ field: 'valueType', message: 'Invalid value type' });
    }

    if (typeof reward.stock !== 'number' || reward.stock < 0) {
      errors.push({ field: 'stock', message: 'Stock must be a non-negative number' });
    }

    if (!['active', 'inactive'].includes(reward.status)) {
      errors.push({ field: 'status', message: 'Invalid reward status' });
    }

    // Check expiry date is in the future if provided
    if (reward.expiryDate && reward.expiryDate <= new Date()) {
      errors.push({ field: 'expiryDate', message: 'Expiry date must be in the future' });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // User validation
  static validateUser(user: User): ValidationResult {
    const errors: ValidationError[] = [];

    if (!this.isValidEmail(user.email)) {
      errors.push({ field: 'email', message: 'Valid email address is required' });
    }

    if (!['admin', 'customer'].includes(user.role)) {
      errors.push({ field: 'role', message: 'Invalid user role' });
    }

    if (!this.isValidPoints(user.points)) {
      errors.push({ field: 'points', message: 'Points must be a non-negative integer' });
    }

    if (!['active', 'suspended'].includes(user.status)) {
      errors.push({ field: 'status', message: 'Invalid user status' });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Quiz submission validation
  static validateQuizSubmission(submission: QuizSubmission, quiz: Quiz): ValidationResult {
    const errors: ValidationError[] = [];

    if (!submission.quizId || submission.quizId.trim().length === 0) {
      errors.push({ field: 'quizId', message: 'Quiz ID is required' });
    }

    if (!submission.userId || submission.userId.trim().length === 0) {
      errors.push({ field: 'userId', message: 'User ID is required' });
    }

    if (!this.isValidEmail(submission.userEmail)) {
      errors.push({ field: 'userEmail', message: 'Valid user email is required' });
    }

    if (typeof submission.score !== 'number' || submission.score < 0) {
      errors.push({ field: 'score', message: 'Score must be a non-negative number' });
    }

    if (typeof submission.totalQuestions !== 'number' || submission.totalQuestions <= 0) {
      errors.push({ field: 'totalQuestions', message: 'Total questions must be greater than 0' });
    }

    if (typeof submission.correctAnswers !== 'number' || 
        submission.correctAnswers < 0 || 
        submission.correctAnswers > submission.totalQuestions) {
      errors.push({ field: 'correctAnswers', message: 'Correct answers must be between 0 and total questions' });
    }

    // Validate score doesn't exceed maximum possible points
    const maxScore = Math.round((submission.correctAnswers / submission.totalQuestions) * quiz.points);
    if (submission.score > maxScore) {
      errors.push({ field: 'score', message: 'Score exceeds maximum possible points for this quiz' });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Generic validation helper
  static validateRequired(obj: any, requiredFields: string[]): ValidationResult {
    const errors: ValidationError[] = [];

    requiredFields.forEach(field => {
      if (!obj[field] || (typeof obj[field] === 'string' && obj[field].trim().length === 0)) {
        errors.push({ field, message: `${field} is required` });
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
