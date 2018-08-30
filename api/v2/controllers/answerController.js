import pool from '../config/config';

/** Class representing a question. */
export default class Answers {
  /**
 * /POST a single question
 *
 * @async
 * @function post a question in the database with user id
 * @param {req} url - The request obj that handles request that is coming in.
 * @param {res} url - The response obj that handles response from request.
 * @return {HTTP status<objec>, json} The rows of data  from the URL.
 */
  static async createAnswer(req, res) {
    const id = parseInt(req.params.id, 10);
    try {
      const { rows } = await pool.query(`INSERT INTO answers (reply, user_id, question_id) 
    VALUES($1, $2, $3) RETURNING *`,
      [req.body.reply, req.userid, id]);
      res.status(200).json({
        status: '200 OK',
        message: 'Operation successful!',
        question: rows,
      });
    } catch (error) {
      res.send({ message: `Error ${error}` });
    }
  }
  /**
 * update an existing answer in the database
 *
 * @async
 * @function to update an existing answer
 * @param {req} url - the request cycle from express that carries client requests
 * @param {res} url - the response cycle from express that carries client requests
 * @return {data} The data from the database.
 */

  static async updateAnswer(req, res) {
    const userId = req.userid;
    const { questionId, answerId } = req.params;
    const { reply } = req.body;
    try {
      const checkQuestion = await pool.query(`SELECT * FROM questions
       WHERE question_id = $1`, [questionId]);
      if (checkQuestion.rowCount === 0) {
        return res.status(404).json({
          status: '404 NOT FOUND',
          message: 'question does not exist',
        });
      }
      const checkIfAnswerExists = await pool
        .query('SELECT answer_id FROM answers WHERE answers.answer_id = $1', [answerId]);
      if (checkIfAnswerExists.rowCount === 0) {
        return res.status(404).json({
          status: '404 NOT FOUND',
          message: 'Answer does not exist for this question',
        });
      }
      if (userId === checkQuestion.rows[0].user_id) {
        const acceptedAnswer = await pool
          .query('UPDATE answers SET status = $1 WHERE answer_id = $2 RETURNING *',
            ['Accepted', answerId]);
        return res.status(200).json({
          status: '200 OK',
          message: 'Answer has been set to accepted',
          answer: acceptedAnswer.rows,
        });
      }
      if (userId === checkIfAnswerExists.rows[0].user_id) {
        const updateResult = await pool
          .query(`UPDATE answers SET reply= $1 WHERE answer_id = $2 
          AND user_id =$3 RETURNING *`, [reply, answerId, userId]);
        if (updateResult.rowCount > 0) {
          return res.status(200).json({
            status: 'success',
            message: 'Answer has been updated successfully',
            answer: updateResult.rows,
          });
        }
      }
      return res.status(403).json({
        status: '401 UNAUTHORIZED',
        message: 'You are unathorized!',
      });
    } catch (error) {
      res.status(500).json({ message: `Bad request : Error: ${error}` });
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
  static async createComment(req, res) {
    try {
      const id = parseInt(req.params, 10);
      const { rows } = await pool.query(`INSERT INTO comments (comment, user_id, answer_id) 
    VALUES($1, $2, $3) RETURNING *`,
      [req.body.comment, req.userid, id]);
      res.status(200).json({
        status: '200 OK',
        message: 'Operation successful!',
        question: rows,
      });
    } catch (error) {
      res.status(500).json({ message: `Bad request : Error: ${error}` });
    }
  }
}
