function getPlanStorageLimit(plan) {
    if (plan === 'free') {
      return '1 GB';
    } else if (plan === 'standart') {
      return '3 GB';
    } else if (plan === 'business') {
      return '100 GB';
    } else if (plan === 'premium') {
      return '1000 GB';
    } else {
      return '1 kB';
    }
  }