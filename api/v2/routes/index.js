import express from 'express';
import Auth from '../auth/authController';
import verifyToken from '../middlewares/verifyToken';
import Question from '../controllers/questionController';
import Answer from '../controllers/answerController';
import Validator from '../middlewares/inputValidator';
import authValidator from '../middlewares/authValidator';

const router = express.Router();
/**
 * @ v2
 * with persistence database
 * welcome message
 */
router.get('/', (req, res) => res.send({ message: 'Successful!, Welcome to LiteStack API v2!' }));
/**
 *  for questions authentication controller
 *
 *
 */
router.post('/auth/signup', authValidator.signup, Auth.signUp);
router.post('/auth/login', authValidator.login, Auth.login);
/** @router for questions controller */
router.get('/questions', Question.GetAllQuestions);
router.get('/questions/:id', Question.GetOneQuestion);
router.post('/questions', Validator.QuestionInput, verifyToken, Question.createQuestion);
router.delete('/questions/:id', verifyToken, Question.removeQuestion);
router.post('/questions/:id/answers', Validator.AnswerInput, verifyToken, Answer.createAnswer);
router.put('/questions/:id/answers/:id', verifyToken, Answer.updateAnswer);
/** @router additional feature routes */
router.post('/answers/:id/comments', Validator.CommentInput, verifyToken, Answer.createComment);
router.get('users/questions', verifyToken, Question.GetUserQuestions);
router.get('/questions/answers', Question.GetAllQuestionsAnswers);


export default router;
