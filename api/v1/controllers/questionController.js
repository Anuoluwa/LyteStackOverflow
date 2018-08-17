import questions from '../models/db';

export default class Questions {
  static async GetAllQuestions(req, res) {
    try {
      return await res.json(questions);
    } catch (err) {
      await !questions;
      res.status(404).json({ message: 'Resource not found!', error: err });
    }
  }

  static async GetOneQuestion(req, res) {
    try {
      const questionId = await req.params.id;
      /* eslint-disable */
      const questionItem = await questions.filter(question => question.id == questionId)[0];
      /* eslint-enable */
      return res.status(200).json(questionItem);
    } catch (err) {
      res.sendStatus(404).json({ message: err });
    }
  }

  static setQuestion(req, res) {
    // async or promise later
    const question = {
      id: questions.length + 1,
      date: req.body.date,
      title: req.body.title,
      body: req.body.body,
      answer: req.body.answer,
    };
    questions.push(question);
    if (question) {
      res.status(201).json(question);
    } else {
      res.status(404).json({ message: 'Resource not created!' });
    }
  }
}
