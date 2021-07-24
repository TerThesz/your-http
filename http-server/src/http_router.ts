function router(this: any) {
  this.functions = [];

  function settings(_this: any, path: string, fns: Function[], method: string) {
    _this.functions.push({ method, path, fns });

    return _this;
  }

  this.get = function(this: any, path: string, ...fns: Function[]) { return settings(this, path, fns, 'GET'); };
  this.push = function(this: any, path: string, ...fns: Function[]) { return settings(this, path, fns, 'PUSH'); };
  this.update = function(this: any, path: string, ...fns: Function[]) { return settings(this, path, fns, 'UPDATE'); };
  this.patch = function(this: any, path: string, ...fns: Function[]) { return settings(this, path, fns, 'PATCH'); };
  this.delete = function(this: any, path: string, ...fns: Function[]) { return settings(this, path, fns, 'DELETE'); };
}

router.prototype.callFunctions = function (this: any, req: any, res: any) {
  let next = false;

  console.log(JSON.stringify(this.functions, null, 2));

  this.functions.every((fnObject: { [key: string]: any }) => {
    const { method, url } = req;

    if (!fnObject.method || !fnObject.path || !fnObject.fns) throw 'Invalid router.';

    if (fnObject.method === method && fnObject.path === url) 
    fnObject.fns.every((fn: Function) => {
      fn(req, res, () => next = true);

      if (this.wasSent) next = false;

      return next;
    });

    return next;
  });
}

export { router };