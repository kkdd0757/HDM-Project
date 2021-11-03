const modals = {
  repeat: {
    type: 'repeat',
    title: '다시 시작하시겠어요?',
    describtion: '다시 시작하시면 현재까지의 녹음기록은 전부 지워집니다.',
    cancle: true,
    button: '다시 시작',
  },
  submit: {
    type: 'submit',
    title: '답변을 제출하시겠어요?',
    describtion: '답변을 제출하시면 현재까지 녹음된 기록이 저장됩니다.',
    cancle: true,
    button: '답변 제출',
  },
  timeout: {
    type: 'timeout',
    title: '시간이 종료되었습니다.',
    describtion: '다음 문제 버튼을 누르시면 다음 질문이 재생됩니다.',
    cancle: false,
    button: '다음 문제',
  },
  result: {
    type: 'result',
    title: '고생하셨습니다.',
    describtion: '결과 보기 버튼을 누르시면 결과 창으로 이동합니다.',
    cancle: false,
    button: '결과 보기',
  },
};

export default modals;