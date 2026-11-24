import Foundation
import PDFKit
let d=PDFDocument(url:URL(fileURLWithPath:CommandLine.arguments[1]))!
var rows:[[String:Any]]=[]
for i in 1..<10 { let p=d.page(at:i)!; for s in p.selection(for:p.bounds(for:.mediaBox))!.selectionsByLine(){rows.append(["page":i+1,"x":Double(s.bounds(for:p).minX),"y":Double(s.bounds(for:p).minY),"text":s.string ?? ""])} }
let data=try! JSONSerialization.data(withJSONObject:rows,options:[.prettyPrinted,.sortedKeys]);print(String(data:data,encoding:.utf8)!)
