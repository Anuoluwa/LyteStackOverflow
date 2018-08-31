import pool from '../config/config';

/** Class representing a question. */
export default class Questions {
  /**
 * /GET all questions
 *
 * @async
 * @function get all questions in the database
 * @param {req} url - The request obj that handles request that is coming in.
 * @param {res} url - The response obj that handles response from request.
 * @return {HTTP status<objec>, json} The rows of data  from the URL.
 */
  static async GetAllQuestions(req, res) {
    try {
      const result = await pool
        .query('SELECT * FROM questions');
      res.status(200).json({
        status: '200 OK',
        message: 'Operation successful!',
        questions: result.rows,
      });
      if (result.length == 0) {
        return res.status(404).json({
          status: '404 NOT FOUND',
          message: 'No question is available',
        });
      }
    } catch (error) {
      res.send({ message: `Error ${error}` });
    }
  }

  /**
 * /GET a single question
 *
 * @async
 * @function get a question in the database
 * @param {req} url - The request obj that handles request that is coming in.
 * @param {res} url - The response obj that handles response from request.
 * @return {HTTP status<objec>, json} The rows of data  from the URL.
 */
  static async GetOneQuestion(req, res) {
    try {
      const questions = await pool
        .query('SELECT * FROM questions WHERE question_id = $1',
          [req.params.id]);
      if (questions.length === 0) {
        res.status(404).json({
          status: '404 NOT FOUND',
          message: `The question with this id: ${req.params.id} does not exist!`,
        });
      } else {
        const answers = await pool.query('SELECT * FROM answers WHERE question_id=$1', [req.params.id]);
        res.status(200).json({
          status: '200 OK',
          message: 'Operation successful!',
          question: questions.rows,
          answers: answers.rows,
        });
      }
    } catch (error) {
      res.send({ message: `Error ${error}` });
    }
  }

  /**
 * /POST a single question
 *
 * @async
 * @function post a question in the database with user id
 * @param {req} url - The request obj that handles request that is coming in.
 * @param {res} url - The response obj that handles response from request.
 * @return {HTTP status<objec>, json} The rows of data  from the URL.
 */
  static async createQuestion(req, res) {
    try {
      const result = await pool.query(`INSERT INTO questions (title, body, user_id,
        created_at) VALUES($1, $2, $3, Now()) RETURNING *`,
      [req.body.title, req.body.body, req.userid]);
      res.status(200).json({
        status: '200 OK',
        message: 'Operation successful!',
        question: result,
      });
    } catch (error) {
      res.send({ message: `Error ${error}` });
    }
  }

  /**
 * /DELETE a question by user
 *
 * @async
 * @function delete a question in the database
 * @param {req} url - The request obj that handles request that is coming in.
 * @param {res} url - The response obj that handles response from request.
 * @return {HTTP status<object>, json} The rows of data  from the URL.
 */

  static async removeQuestion(req, res) {
    const id = parseInt(req.params.id, 10);
    const { userId } = req.body;
    try {
      const findQuestion = await pool
        .query('SELECT * FROM questions WHERE question_id = $1',
          [id]);
      const findAnswer = await pool
        .query('SELECT * FROM answers WHERE question_id = $1',
          [id]);
      if (findQuestion.rowCount === 0) {
        res.status(404).json({
          status: '404 NOT FOUND',
          message: 'The question does not exist!',
        });
      }
      if (findQuestion.rows[0].user_id === userId ) {
        res.status(401).json({
          status: '404 Unathorized',
          message: 'You are not the owner of the question!',
        });
      }
      if (findAnswer.rowCount < 1) {
        await pool.query('DELETE FROM questions WHERE question_id=$1', [req.question_id]);
      } else {
        await pool
            .query('DELETE FROM answers WHERE question_id = $1',
              [req.question_id]);

      }
    } catch (error) {
      res.send({ message: `Error ${error}` });
    }
  }

  /**
 * /GET all questions
 *
 * @async
 * @function get all questions in the database
 * @param {req} url - The request obj that handles request that is coming in.
 * @param {res} url - The response obj that handles response from request.
 * @return {HTTP status<objec>, json} The rows of data  from the URL.
 */

  static async GetUserQuestions(req, res) {
    try {
      const result = await pool
        .query('SELECT * FROM questions WHERE user_id=$1', [req.userid]);
      res.status(200).json({
        message: 'Operation successful!',
        status: '200 OK',
        questions: result,
      });
      if (result.rows.length === 0) {
        return res.status().json({
          status: '200 ok',
          message: 'No question is available',
        });
      }
    } catch (error) {
      res.send({ message: `Error ${error}` });
    }
  }

  static async GetAllQuestionsAnswers(req, res) {
    try {
      const result = await pool
        .query(`SELECT title, body, reply, COUNT(answers.question_id) FROM questions
                JOIN answers ON answers.question_id = questions.question_id
                GROUP BY reply, title, body, answers.question_id
                ORDER BY answers.question_id DESC`);
      if (result.rows.length === 0) {
        return res.status().json({ message: 'No question is available' });
      }
      res.status(200).json({
        status: '200 OK',
        message: 'Operation successful!',
        questions: result,
      });
    } catch (error) {
      res.status(500).json({ message: `Bad request : Error: ${error}` });
    }
  }
}
