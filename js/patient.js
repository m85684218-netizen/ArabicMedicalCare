/* patient.js - read-only patient page. No create/edit/delete code exists here. */
(function () {
  var main = document.getElementById('main');
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var nr = function (v) { return v ? esc(v) : '<span class="nr">غير مسجل</span>'; };
  var ndate = function (d) { if (!d) return nr(''); var t = new Date(d + 'T00:00:00'); return esc(isNaN(t) ? d : t.toLocaleDateString('ar-EG-u-nu-latn', { year: 'numeric', month: 'long', day: 'numeric' })); };

  function messageView() {
    return '<div class="empty"><h1>الرابط غير صحيح</h1><p>تعذر العثور على سجل لهذا الرابط. تأكد من مسح رمز QR الصحيح.</p></div>';
  }
  function entryHtml(sec, e) {
    var def = Records.SECTIONS[sec];
    var lines = def.fields.filter(function (f) { return f.key !== def.title && f.type !== 'checkbox'; }).map(function (f) {
      return '<p><span class="lb">' + esc(f.label) + ':</span> ' + (f.type === 'date' ? ndate(e[f.key]) : nr(e[f.key])) + '</p>';
    }).join('');
    var badges = (e.chronic ? '<span class="badge chronic">مزمنة</span>' : '') + (e.status ? '<span class="badge">' + esc(e.status) + '</span>' : '') + (e.severity ? '<span class="badge' + (e.severity === 'شديدة' ? ' sev' : '') + '">' + esc(e.severity) + '</span>' : '');
    return '<div class="entry"><h3>' + esc(e[def.title]) + badges + '</h3>' + lines + '</div>';
  }
  function profileView(p) {
    var item = function (l, v) { return '<div><dt>' + l + '</dt><dd>' + v + '</dd></div>'; };
    return '<div class="row between"><div><h1>' + esc(p.fullName) + '</h1><p class="sub">رقم السجل <bdi>' + esc(p.id) + '</bdi> | عرض للقراءة فقط</p></div></div>' +
      '<div class="card"><h2 style="margin-bottom:12px">البيانات الشخصية</h2><dl class="info">' + item('الرقم القومي', nr(p.nationalId)) + item('تاريخ الميلاد', ndate(p.dob)) + item('النوع', nr(p.gender)) + item('فصيلة الدم', nr(p.bloodType)) + item('الهاتف', nr(p.phone)) + item('البريد الإلكتروني', nr(p.email)) + item('العنوان', nr(p.address)) +
      item('جهة الاتصال للطوارئ', nr(p.emergencyName)) + item('هاتف الطوارئ', nr(p.emergencyPhone)) + item('ملاحظات صحية عامة', nr(p.notes)) + '</dl></div>' +
      Object.keys(Records.SECTIONS).map(function (sec) {
        var list = p[sec];
        return '<section class="card" aria-labelledby="h-' + sec + '"><h2 id="h-' + sec + '">' + Records.SECTIONS[sec].label + '</h2>' +
          (list.length ? list.map(function (e) { return entryHtml(sec, e); }).join('') : '<p class="nr">غير مسجل. القسم الفارغ لا يعني عدم وجود شيء يستحق الذكر.</p>') + '</section>';
      }).join('');
  }
  var token = new URLSearchParams(location.search).get('t') || '';
  var person = token && People.all().find(function (p) { return p.token === token; });
  main.innerHTML = person ? profileView(person) : messageView();
})();
